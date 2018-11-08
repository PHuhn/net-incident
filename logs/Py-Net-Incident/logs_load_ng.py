""" module: NetGear logs load of network incidents """
from pathlib import Path
import re
from datetime import datetime
import network_log_incident
import sql_server
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
    def log_process_parse_ng_log(self, incident_type, log) -> network_log_incident.NetworkLogIncident:
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
        return network_log_incident.NetworkLogIncident(
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
    def log_process_ng_main(self, server, db_name, file_path, server_id):
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
            log_file = open(file_path, "r")
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
# > python logs_load_ng.py --server .\Express --filePath .\data\NG-300-2018-05-03.txt --serverId 8
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
                        help='Full path and file name of NetGear logs')
    # PARAMETER serverId:
    #  An integer value of the server logs that are being loaded
    PARSER.add_argument('--serverId', metavar='server_id', required=True,
                        help='An integer value of the server logs that are being loaded')
    ARGS = PARSER.parse_args()
    # call main load NetGear logs
    LOGS_LOAD = LogsLoadNG()
    LOGS_LOAD.log_process_ng_main(server=ARGS.server, db_name=ARGS.dbName,
                                  file_path=ARGS.filePath, server_id=ARGS.serverId)
#        1         2         3         4         5         6         7         8         9        10
#234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
