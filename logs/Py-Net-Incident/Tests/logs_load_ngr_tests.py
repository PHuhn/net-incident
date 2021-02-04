""" module: for testing netgear logs loading """
import unittest
import logs_load
import sql_server
#
class LogsLoadNGTests(unittest.TestCase):
    """ class: for testing netgear logs loading """
    #
    def setUp(self):
        self.ld_ngr = logs_load.LogsLoadNGR()
        self.ld_ngr.sql_server = sql_server.SqlServer()
        self.server = '.\\Express'
        self.database = 'NetIncident2'
        self.dos_log = "[DoS attack: RST Scan] from source: 54.203.85.98:8883, Tuesday, February 02,2021 05:37:39      "
        self.dos2_log = "[DoS attack: TCP Port Scan] from source: 194.165.16.16:65533, Tuesday, February 02,2021 11:50:59      "
        self.adm_log = "[admin login] from source 192.168.1.22, Wednesday, February 03,2021 15:01:09    "
        self.ok_log = "[DHCP IP: (192.168.1.22)] to MAC address 34:F6:4B:6C:31:D0, Wednesday, February 03,2021 14:43:57    "
    #
    def test_log_process_parse_ngr_log(self):
        """ test of: log_process_parse_ngr_log, log is to be written, parse and
        written to NetworkLogs. """
        network_log = self.ld_ngr.log_process_parse_ngr_log(1, self.dos_log)
        self.assertEqual(-1, network_log.server_id)
        self.assertEqual(1, network_log.incident_type)
        self.assertEqual('54.203.85.98', network_log.ip_address)
        self.assertEqual('February 02 2021 05:37:39', network_log.network_log_date)
        self.assertEqual(self.dos_log.rstrip(), network_log.log)
    #
    def test_log_process_parse_ngr_log2(self):
        """ test of: log_process_parse_ngr_log, log is to be written, parse and
        written to NetworkLogs.
        [DoS attack: TCP Port Scan] from source: 194.165.16.16:65533, Tuesday, February 02,2021 11:50:59"""
        network_log = self.ld_ngr.log_process_parse_ngr_log(1, self.dos2_log)
        self.assertEqual(-1, network_log.server_id)
        self.assertEqual(1, network_log.incident_type)
        self.assertEqual('194.165.16.16', network_log.ip_address)
        self.assertEqual('February 02 2021 11:50:59', network_log.network_log_date)
        self.assertEqual(self.dos2_log.rstrip(), network_log.log)
    #
    def test_log_process_ngr_line_with_dos_log(self):
        """ test of: log_process_ngr_line, process a single dos log record. """
        from unittest.mock import patch
        with patch("pyodbc.connect") as mock_connect:
            # Set-up
            mock_connect.return_value.cursor.return_value.rowcount.return_value = 1
            # Act
            self.ld_ngr.sql_server.sql_connection('mock connection string')
            count = self.ld_ngr.log_process_ngr_line(self.dos_log)
            print(self.ld_ngr.sql_server.connection)
            print(count)
            # Assert
            mock_connect.assert_called_with('mock connection string')
            self.assertEqual(count.return_value, 1)
            mock_connect.return_value.cursor.return_value.execute.assert_called()
            mock_connect.return_value.cursor.return_value.execute.assert_called_with("INSERT INTO dbo.NetworkLog (ServerId, IPAddress, NetworkLogDate, [Log], IncidentTypeId) VALUES( -1, '54.203.85.98', 'February 02 2021 05:37:39', '[DoS attack: RST Scan] from source: 54.203.85.98:8883, Tuesday, February 02,2021 05:37:39', -1 )")
    #
    def test_log_process_ngr_line_with_adm_log(self):
        """ test of: log_process_ngr_line, process a single admin log record. """
        from unittest.mock import patch
        with patch("pyodbc.connect") as mock_connect:
            # Set-up
            # Act
            self.ld_ngr.sql_server.sql_connection('mock connection string')
            count = self.ld_ngr.log_process_ngr_line(self.adm_log)
            # Assert
            mock_connect.assert_called_with('mock connection string')
            self.assertEqual(count, 0)
            self.assertEqual(len(self.ld_ngr.warning_logs), 1)
            self.assertEqual(self.ld_ngr.warning_logs[0], self.adm_log)
    #
    def test_log_process_load_ngr_incident_types(self):
        """ test of: log_process_load_ngr_incident_types, loads in a static amount of incidentType
        that go to the short description.
        """
        self.ld_ngr.sql_server.sql_connection(
            self.ld_ngr.sql_server.sql_connection_trusted_string(self.server, self.database))
        self.ld_ngr.log_process_load_ngr_incident_types()
        self.assertNotEqual(-1, self.ld_ngr.dos_inc_type)
    #
if __name__ == '__main__':
    unittest.main()
