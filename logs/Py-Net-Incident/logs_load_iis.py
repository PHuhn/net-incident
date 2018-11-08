""" module: IIS logs load """
from pathlib import Path
import re
from datetime import datetime
import network_log_incident
import sql_server
#
class LogsLoadIIS(object):
    """ class: for loading iis network incident logs """

    def __init__(self):
        self.sql_server = object
        self.server_id = -1
        self.uri_query_idx = 5
        self.php_inc_type = -1
        self.sql_inc_type = -1
        self.vs_inc_type = -1
        self.xss_inc_type = -1
    #
    ##
    # log_process functions:
    #   log_process_load_iis_incident_types
    #   log_process_parse_iis_log
    #   log_process_php_log
    #   log_process_sql_log
    #   log_process_xss_log
    #   log_process_iis_line
    #   log_process_iis_main
    ##
    def log_process_load_iis_incident_types(self):
        """ load the needed incident types """
        rows = self.sql_server.sql_fetchall(
            "SELECT IncidentTypeId, IncidentTypeShortDesc FROM dbo.IncidentType WHERE IncidentTypeShortDesc IN ( 'php', 'sql', 'vs', 'xss' );")
        for _, row in enumerate(rows):
            short_desc = str(row.IncidentTypeShortDesc).lower()
            if short_desc == 'php':
                self.php_inc_type = row.IncidentTypeId
            if short_desc == 'sql':
                self.sql_inc_type = row.IncidentTypeId
            if short_desc == 'vs':
                self.vs_inc_type = row.IncidentTypeId
            if short_desc == 'xss':
                self.xss_inc_type = row.IncidentTypeId
    #
    def log_process_parse_iis_log(self, incident_type, log) -> network_log_incident.NetworkLogIncident:
        """ log is to be written, parse and write to NetworkLogs. """
        # Alternately could do something like the following:
        # network_log = { 'server': 8, 'type': 1, 'ipAddr': '10.0.0.10', 'date': '2018-11-03', 'log': ''}
        columns = log.split(' ')
        dat = columns[0]
        tim = columns[1]
        network_log_date = dat + ' ' + tim
        datetime.strptime(network_log_date, '%Y-%m-%d %H:%M:%S')
        ip_address = columns[2]
        log = re.sub("'", "''", log)
        return network_log_incident.NetworkLogIncident(
            self.server_id, incident_type, ip_address, network_log_date, log)
    #
    def log_process_php_log(self, uri_query) -> bool:
        """ Sample IIS PHP log
        [Stream URI Injection Attack (incl. Local/Remote File Inclusion)]:
        2018-05-29 00:11:44 10.10.1.10 GET / -dallow_url_include=on+-dauto_prepend_file=php://input 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1
        """
        ret = False
        match = re.search(".allow_url_include=on.", uri_query)
        if match:
            # URIs containing php://, ogg://, zlib://, zip:// and data:// among a few others
            match = re.search(".auto_prepend_file=.", uri_query)
            if match:
                ret = True
        return ret
    #
    def log_process_sql_log(self, uri_query) -> bool:
        """ Sample IIS SQL injection log:
        2018-05-28 23:59:48 10.10.1.10 GET / Category=Files&Id=62'A=0 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1
        """
        ret = False
        match = re.search(r"'|\-\-", uri_query)
        if match:
            ret = True
        return ret
    #
    def log_process_xss_log(self, uri_query) -> bool:
        """
        Sample IIS XSS log:
        2018-05-29 00:13:44 10.10.1.10 GET / ReturnUrl=%3Cscript%3Ealert(%22xssvuln%22)%3C/script%3E 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1
        """
        # if( $columns[5] -like "*%3Cscript%3E*" -and $columns[5] -like "*%3C/script%3E*" )
        ret = False
        # <script and </script>
        match = re.search(".%3Cscript.", uri_query)
        if match:
            match = re.search(".%3C/script%3E", uri_query)
            if match:
                ret = True
        return ret
    #
    def log_process_iis_line(self, log):
        """ process a single log record. """
        count = 0
        if log != '':
            if log[0] != '#':
                columns = log.split(' ')
                if len(columns) > self.uri_query_idx:
                    if self.log_process_php_log(columns[self.uri_query_idx]):
                        network_log = self.log_process_parse_iis_log(self.php_inc_type, log)
                        count = self.sql_server.sql_execute(network_log.sql_insert_network_log_string())
                    if self.log_process_sql_log(columns[self.uri_query_idx]):
                        network_log = self.log_process_parse_iis_log(self.sql_inc_type, log)
                        count = self.sql_server.sql_execute(network_log.sql_insert_network_log_string())
                    if self.log_process_xss_log(columns[self.uri_query_idx]):
                        network_log = self.log_process_parse_iis_log(self.xss_inc_type, log)
                        count = self.sql_server.sql_execute(network_log.sql_insert_network_log_string())
        return count
    #
    def log_process_iis_main(self, server, db_name, file_path, server_id):
        """ function: application main """
        print("NetGear arguments are: ", server, db_name, file_path, server_id)
        #
        input_file = Path(file_path)
        if input_file.exists():
            # NetGear logs path/file exists
            self.sql_server = sql_server.SqlServer()
            self.sql_server.sql_connection(
                self.sql_server.sql_connection_trusted_string(server, db_name))
            self.log_process_load_iis_incident_types()
            self.server_id = int(server_id)
            log_file = open(file_path, "r")
            for line in log_file:
                self.log_process_iis_line(line.rstrip())
            log_file.close()
        else:
            print(file_path, ' not found')
#
# > python logs_load_iis.py --server .\Express --filePath .\data\iis.log --serverId 8
if __name__ == '__main__':
    import argparse
    #
    PARSER = argparse.ArgumentParser(description='Load IIS logs to database')
    # PARAMETER server: SQL Server instance name,
    #   . can be used for local instance or .\SQLExpress for default
    #   instance name for Express version.
    PARSER.add_argument('--server', metavar=r'server ((.\SQLExpress)',
                        default=r'.\SQLExpress', help='SQL Server instance name')
    # PARAMETER dbName: Database name
    PARSER.add_argument('--dbName', metavar='db_name (NetIncident2))',
                        default='NetIncident2', help='Database name')
    # PARAMETER filePath: Full path and file name
    PARSER.add_argument('--filePath', metavar='file_path', required=True,
                        help='Full path and file name of IIS logs')
    # PARAMETER serverId:
    #  An integer value of the server logs that are being loaded
    PARSER.add_argument('--serverId', metavar='server_id', required=True,
                        help='An integer value of the server logs that are being loaded')
    ARGS = PARSER.parse_args()
    # call main load IIS logs
    LOGS_LOAD = LogsLoadIIS()
    LOGS_LOAD.log_process_iis_main(server=ARGS.server, db_name=ARGS.dbName,
                                   file_path=ARGS.filePath, server_id=ARGS.serverId)
#        1         2         3         4         5         6         7         8         9        10
#234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
