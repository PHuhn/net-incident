""" module main: choose and launch appropriate loader """
#
from pathlib import Path
import re
from datetime import datetime
import argparse
import sql_server
#
class NetworkLogIncident():
    """ structure of data to be written to database """
    def __init__(self, server_id, incident_type, ip_address, network_log_date, log):
        self.server_id = server_id
        self.incident_type = incident_type
        self.ip_address = ip_address
        self.network_log_date = network_log_date
        self.log = log
    #
    def sql_insert_network_log_string(self):
        """ construct an insert command, INSERT INTO dbo.NetworkLog """
        sql_command = ''
        if self.ip_address != '' and self.network_log_date != '':
            sql_values = "VALUES( {0}, '{1}', '{2}', '{3}', {4} )".format(self.server_id, \
                self.ip_address, self.network_log_date, self.log, self.incident_type)
            sql_command = 'INSERT INTO dbo.NetworkLog (' +\
                'ServerId, IPAddress, NetworkLogDate, [Log], IncidentTypeId) ' + sql_values
            print(sql_values)
        else:
            print('ERROR: bad ip or date: ', self.log)
        return sql_command
    #
    def to_string(self):
        """ method: formated to string """
        return 'server_id: ' + str(self.server_id) + \
               ', incident_type: ' + self.incident_type + \
               ', ip_address: ' + self.ip_address + \
               ', network_log_date: ' + self.network_log_date + ', log: ' + self.log
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
    def log_process_parse_iis_log(self, incident_type, log) -> NetworkLogIncident:
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
        return NetworkLogIncident(
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
    def log_process_main(self, server, db_name, file_path, server_id):
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
class LogsLoadNG(object):
    """ class: NetGear logs load of network incidents """
    def __init__(self):
        self.sql_server = object
        self.server_id = -1
        self.dos_inc_type = -1
        self.warning_logs = []
    #
    def log_process_load_ng_incident_types(self):
        """ load the needed incident types """
        rows = self.sql_server.sql_fetchall(
            "SELECT IncidentTypeId, IncidentTypeShortDesc FROM dbo.IncidentType WHERE IncidentTypeShortDesc IN ( 'dos' );")
        for _, row in enumerate(rows):
            short_desc = str(row.IncidentTypeShortDesc).lower()
            if short_desc == 'dos':
                self.dos_inc_type = row.IncidentTypeId
    #
    def log_process_parse_ng_log(self, incident_type, log) -> NetworkLogIncident:
        """
        log is to be parse and write to NetworkLogs.
        [DoS attack: FIN Scan] attack packets in last 20 sec from ip [63.251.98.12], Thursday, May 03,2018 05:46:58
        """
        ip_address = ''
        network_log_date = ''
        match = re.findall('\[([^\]]*)\]', log)
        if match:
            ip_address = match[1]
        text = log.split(',')
        if len(text) > 2:
            dat = text[2].lstrip()
            tim = text[3]
            network_log_date = dat + ' ' + tim
        datetime.strptime(network_log_date, '%b %d %Y %H:%M:%S')
        return NetworkLogIncident(
            self.server_id, incident_type, ip_address, network_log_date, log)
    #
    def log_process_ng_line(self, log):
        """ process a single log record. """
        count = 0
        if log != '':
            if log[0] == '[':
                if log[0:12] == '[DoS attack:':
                    network_log = self.log_process_parse_ng_log(self.dos_inc_type, log)
                    count = self.sql_server.sql_execute(network_log.sql_insert_network_log_string())
                else:
                    self.warning_logs.append(log)
        return count
    #
    def log_process_main(self, server, db_name, file_path, server_id):
        """ function: application main """
        print("The arguments are: ", server, db_name, file_path, server_id)
        #
        input_file = Path(file_path)
        if input_file.exists():
            # path/file exists
            self.sql_server = sql_server.SqlServer()
            self.sql_server.sql_connection(
                self.sql_server.sql_connection_trusted_string(server, db_name))
            self.log_process_load_ng_incident_types()
            self.server_id = int(server_id)
            compiled_pattern = re.compile("^\[DHCP IP: |^\[Service blocked: ICMP_echo_req|^\[Time synchronized|^\[Internet connected|^\[Internet disconnected|^\[Log Cleared|^\[UPnP set event|^\[WLAN access rejected|^\[email sent to")
            log_file = open(file_path, "r")
            for line in log_file:
                # Ignore the following logs:
                # * [DHCP IP: (192.168
                # * [Service blocked: ICMP_echo_req
                # * [Time synchronized
                # * [Internet connected
                # * [Internet disconnected
                # * [Log Cleared
                # * [UPnP set event
                # * [WLAN access rejected
                # * [email sent to
                # Passed through:
                # * [Admin login]
                # * [Initialized, firmware
                # * [DoS attack:
                match = compiled_pattern.match(line)
                if not match:
                    self.log_process_ng_line(line.rstrip())
            log_file.close()
            if self.warning_logs:
                print('==== Warnings ====')
                for _, log in enumerate(self.warning_logs):
                    print(log)
        else:
            print(file_path, ' not found')
#
class LogsLoadNGR(object):
    """ class: NetGear logs load of network incidents """
    def __init__(self):
        self.sql_server = object
        self.server_id = -1
        self.dos_inc_type = -1
        self.warning_logs = []
    #
    def log_process_load_ngr_incident_types(self):
        """ load the needed incident types """
        rows = self.sql_server.sql_fetchall(
            "SELECT IncidentTypeId, IncidentTypeShortDesc FROM dbo.IncidentType WHERE IncidentTypeShortDesc IN ( 'dos' );")
        for _, row in enumerate(rows):
            short_desc = str(row.IncidentTypeShortDesc).lower()
            if short_desc == 'dos':
                self.dos_inc_type = row.IncidentTypeId
    #
    def log_process_parse_ngr_log(self, incident_type, log) -> NetworkLogIncident:
        """
        log is to be parse and write to NetworkLogs.
        [DoS attack: RST Scan] from source: 43.224.226.181:19725, Saturday, January 30,2021 03:05:33      
        """
        log = log.rstrip()
        ip_address = ''
        network_log_date = ''
        colon = log.split(':')
        if len(colon) > 2:
            ip_address = colon[2].strip()
        text = log.split(',')
        if len(text) > 2:
            dat = text[2].lstrip()
            tim = text[3]
            network_log_date = dat + ' ' + tim
        datetime.strptime(network_log_date, '%B %d %Y %H:%M:%S')
        return NetworkLogIncident(
            self.server_id, incident_type, ip_address, network_log_date, log)
    #
    def log_process_ngr_line(self, log):
        """ process a single log record. """
        count = 0
        if log != '':
            if log[0] == '[':
                if log[0:12] == '[DoS attack:':
                    network_log = self.log_process_parse_ngr_log(self.dos_inc_type, log)
                    count = self.sql_server.sql_execute(network_log.sql_insert_network_log_string())
                else:
                    self.warning_logs.append(log)
        return count
    #
    def log_process_main(self, server, db_name, file_path, server_id):
        """ function: application main """
        print("The arguments are: ", server, db_name, file_path, server_id)
        #
        input_file = Path(file_path)
        if input_file.exists():
            # path/file exists
            self.sql_server = sql_server.SqlServer()
            self.sql_server.sql_connection(
                self.sql_server.sql_connection_trusted_string(server, db_name))
            self.log_process_load_ngr_incident_types()
            self.server_id = int(server_id)
            compiled_pattern = re.compile("^\[DHCP IP: |^\[Service blocked: ICMP_echo_req|^\[Time synchronized|^\[Internet connected|^\[Internet disconnected|^\[Log Cleared|^\[UPnP set event|^\[WLAN access rejected|^\[email sent to")
            log_file = open(file_path, "r")
            for line in log_file:
                # Ignore the following logs:
                # * [DHCP IP: (192.168
                # * [Service blocked: ICMP_echo_req
                # * [Time synchronized
                # * [Internet connected
                # * [Internet disconnected
                # * [Log Cleared
                # * [UPnP set event
                # * [WLAN access rejected
                # * [email sent to
                # Passed through:
                # * [Admin login]
                # * [Initialized, firmware
                # * [DoS attack:
                match = compiled_pattern.match(line)
                if not match:
                    self.log_process_ngr_line(line.rstrip())
            log_file.close()
            if self.warning_logs:
                print('==== Warnings ====')
                for _, log in enumerate(self.warning_logs):
                    print(log)
        else:
            print(file_path, ' not found')
#
# > python logs_load.py --logType IIS --server .\Express --filePath .\data\iis.log --serverId 8
# > python logs_load.py --logType NG --server .\Express --filePath .\data\NG-300-2018-05-03.txt --serverId 8
#
if __name__ == '__main__':
    #
    PARSER = argparse.ArgumentParser(description='Load IIS logs to database')
    # PARAMETER logType:
    #  A value defining what log type and factory class to use.
    PARSER.add_argument('--logType', metavar='log_type ((of NG, NGR or IIS)', required=True,
                        help='A magic value defining what type of logs, values: NG/NGR/IIS')
    # PARAMETER server: SQL Server instance name,
    #   . can be used for local instance or .\SQLExpress for default
    #   instance name for Express version.
    PARSER.add_argument('--server', metavar=r'server (.\SQLExpress)',
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
    LOG_TYPE = ARGS.logType.lower()
    if LOG_TYPE == 'ng':
        LOGS_LOAD = LogsLoadNG()
    elif LOG_TYPE == 'ngr':
        LOGS_LOAD = LogsLoadNGR()
    elif LOG_TYPE == 'iis':
        LOGS_LOAD = LogsLoadIIS()
    else:
        print('--logType:', ARGS.logType, ' not found')
        LOGS_LOAD = ''
    #
    if LOGS_LOAD:
        LOGS_LOAD.log_process_main(server=ARGS.server, db_name=ARGS.dbName,
                                   file_path=ARGS.filePath, server_id=ARGS.serverId)
