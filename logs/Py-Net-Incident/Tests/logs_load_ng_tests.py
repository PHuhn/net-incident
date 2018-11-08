""" module: for testing netgear logs loading """
import unittest
import pyodbc
import logs_load_ng
import network_log_incident
import sql_server
#
class LogsLoadNGTests(unittest.TestCase):
    #
    def setUp(self):
        self.ld_ng = logs_load_ng.LogsLoadNG()
        self.ld_ng.sql_server = sql_server.SqlServer()
        self.server = '.\\Express'
        self.database = 'NetIncident2'
        self.dos_log = "[DoS attack: FIN Scan] attack packets in last 20 sec from ip [63.251.98.12], Thursday, May 03,2018 05:46:58"
        self.adm_log = "[Admin login] from source 192.168.8.27, Thursday, May 03,2018 07:58:47"
        self.ok_log = "[DHCP IP: (192.168.8.22)] to MAC address 74:E5:0B:69:9A:D6, Wednesday, May 02,2018 10:42:39"
    #
    def test_log_process_parse_ng_log(self):
        """ test of: log_process_parse_ng_log, log is to be written, parse and
        written to NetworkLogs. """
        network_log = self.ld_ng.log_process_parse_ng_log(1, self.dos_log)
        self.assertEqual(-1, network_log.server_id)
        self.assertEqual(1, network_log.incident_type)
        self.assertEqual('63.251.98.12', network_log.ip_address)
        self.assertEqual('May 03 2018 05:46:58', network_log.network_log_date)
        self.assertEqual(self.dos_log, network_log.log)
    #
    def test_log_process_ng_line_with_dos_log(self):
        """ test of: log_process_ng_line, process a single dos log record. """
        from unittest.mock import patch
        with patch("pyodbc.connect") as mock_connect:
            # Set-up
            mock_connect.return_value.cursor.return_value.rowcount.return_value = 1
            # Act
            self.ld_ng.sql_server.sql_connection('mock connection string')
            count = self.ld_ng.log_process_ng_line(self.dos_log)
            print(self.ld_ng.sql_server.connection)
            print(count)
            # Assert
            mock_connect.assert_called_with('mock connection string')
            self.assertEqual(count.return_value, 1)
            mock_connect.return_value.cursor.return_value.execute.assert_called()
            mock_connect.return_value.cursor.return_value.execute.assert_called_with("INSERT INTO dbo.NetworkLog (ServerId, IPAddress, NetworkLogDate, [Log], IncidentTypeId) VALUES( -1, '63.251.98.12', 'May 03 2018 05:46:58', '[DoS attack: FIN Scan] attack packets in last 20 sec from ip [63.251.98.12], Thursday, May 03,2018 05:46:58', -1 )")
    #
    def test_log_process_ng_line_with_adm_log(self):
        """ test of: log_process_ng_line, process a single admin log record. """
        from unittest.mock import patch
        with patch("pyodbc.connect") as mock_connect:
            # Set-up
            # Act
            self.ld_ng.sql_server.sql_connection('mock connection string')
            count = self.ld_ng.log_process_ng_line(self.adm_log)
            # Assert
            mock_connect.assert_called_with('mock connection string')
            self.assertEqual(count, 0)
            self.assertEqual(len(self.ld_ng.warning_logs), 1)
            self.assertEqual(self.ld_ng.warning_logs[0], self.adm_log)
    #
    def test_log_process_load_ng_incident_types(self):
        """ test of: log_process_load_ng_incident_types, loads in a static amount of incidentType
        that go to the short description.
        """
        self.ld_ng.sql_server.sql_connection(
            self.ld_ng.sql_server.sql_connection_trusted_string(self.server, self.database))
        self.ld_ng.log_process_load_ng_incident_types()
        self.assertNotEqual(-1, self.ld_ng.dos_inc_type)
    #
if __name__ == '__main__':
    unittest.main()
