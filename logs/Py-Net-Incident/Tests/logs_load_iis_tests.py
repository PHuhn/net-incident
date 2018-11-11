""" module: tests for IIS logs load """
import unittest
import logs_load
import sql_server
#
class LogsLoadIISTests(unittest.TestCase):
    """ class: tests for IIS logs load """
    #
    def setUp(self):
        self.ld_iis = logs_load.LogsLoadIIS()
        self.ld_iis.sql_server = sql_server.SqlServer()
        self.server = '.\\Express'
        self.database = 'NetIncident2'
        self.php_log = '2018-05-29 00:11:44 10.10.1.10 GET / -dallow_url_include=on+-dauto_prepend_file=php://input 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1'
        self.sql_log = "2018-05-28 23:59:48 10.10.1.10 GET / Category=Files&Id=62'A=0 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1"
        self.xss_log = '2018-05-29 00:13:44 10.10.1.10 GET / ReturnUrl=%3Cscript%3Ealert(%22xssvuln%22)%3C/script%3E 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1'
        self.ok_log = '2018-05-28 22:16:15 10.10.1.10 GET /images/favicon.ico - 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/66.0.3359.181+Safari/537.36 http://localhost/ 200 0 0 53'
    #
    def tearDown(self):
        del self.ld_iis
    ##
    # log_process functions:
    #   log_process_parse_iis_log
    #   log_process_php_log
    #   log_process_sql_log
    #   log_process_xss_log
    #   log_process_iis_line
    #   log_process_iis_main
    ##
    def test_log_process_parse_iis_log(self):
        """ test of: log_process_parse_iis_log, log is to be written, parse and
        written to NetworkLogs. """
        log = "2018-05-28 23:59:48 10.10.1.10 GET / Category=Files&Id=62''A=0 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1"
        network_log = self.ld_iis.log_process_parse_iis_log(1, self.sql_log)
        self.assertEqual(-1, network_log.server_id)
        self.assertEqual(1, network_log.incident_type)
        self.assertEqual('10.10.1.10', network_log.ip_address)
        self.assertEqual('2018-05-28 23:59:48', network_log.network_log_date)
        self.assertEqual(log, network_log.log)
    #
    #
    def test_log_process_php_log1(self):
        """ test of: log_process_php, check if php probe """
        columns = self.php_log.split(' ')
        self.assertEqual(True, self.ld_iis.log_process_php_log(columns[5]))
    def test_log_process_php_log_none(self):
        """ test of: log_process_php, check if php probe """
        columns = self.ok_log.split(' ')
        self.assertEqual(False, self.ld_iis.log_process_php_log(columns[5]))
    #
    #
    def test_log_process_sql_log_sgl_qt(self):
        """ test of: log_process_sql, check if sql injection probe """
        columns = self.sql_log.split(' ')
        self.assertEqual(True, self.ld_iis.log_process_sql_log(columns[5]))
    def test_log_process_sql_log_dbl_dash(self):
        """ test of: log_process_sql, check if sql injection probe """
        self.assertEqual(True,
                         self.ld_iis.log_process_sql_log(
                             'Category=Files&Id=62--A=0'))
    def test_log_process_sql_log_none(self):
        """ test of: log_process_sql, check if sql injection probe """
        columns = self.ok_log.split(' ')
        self.assertEqual(False, self.ld_iis.log_process_sql_log(columns[5]))
    #
    #
    def test_log_process_xss_log1(self):
        """ test of: log_process_xss, check if xss probe """
        columns = self.xss_log.split(' ')
        self.assertEqual(True, self.ld_iis.log_process_xss_log(columns[5]))
    def test_log_process_xss_log_none(self):
        """ test of: log_process_xss, check if xss probe """
        columns = self.ok_log.split(' ')
        self.assertEqual(False, self.ld_iis.log_process_xss_log(columns[5]))
    #
    def test_log_process_iis_line_with_php_log(self):
        """ test of: log_process_iis_line, process a single php log record. """
        from unittest.mock import patch
        with patch("pyodbc.connect") as mock_connect:
            # Set-up
            mock_connect.return_value.cursor.return_value.rowcount.return_value = 1
            # Act
            self.ld_iis.sql_server.sql_connection('mock connection string')
            count = self.ld_iis.log_process_iis_line(self.php_log)
            print(self.ld_iis.sql_server.connection)
            print(count)
            # Assert
            mock_connect.assert_called_with('mock connection string')
            self.assertEqual(count.return_value, 1)
            mock_connect.return_value.cursor.return_value.execute.assert_called()
            mock_connect.return_value.cursor.return_value.execute.assert_called_with("INSERT INTO dbo.NetworkLog (ServerId, IPAddress, NetworkLogDate, [Log], IncidentTypeId) VALUES( -1, '10.10.1.10', '2018-05-29 00:11:44', '2018-05-29 00:11:44 10.10.1.10 GET / -dallow_url_include=on+-dauto_prepend_file=php://input 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1', -1 )")
    #
    def test_log_process_iis_line_with_sql_log(self):
        """ test of: log_process_iis_line, process a single sql log record. """
        from unittest.mock import patch
        with patch("pyodbc.connect") as mock_connect:
            # Set-up
            mock_connect.return_value.cursor.return_value.rowcount.return_value = 1
            # Act
            self.ld_iis.sql_server.sql_connection('mock connection string')
            count = self.ld_iis.log_process_iis_line(self.sql_log)
            print(self.ld_iis.sql_server.connection)
            print(count)
            # Assert
            mock_connect.assert_called_with('mock connection string')
            self.assertEqual(count.return_value, 1)
            mock_connect.return_value.cursor.return_value.execute.assert_called()
            mock_connect.return_value.cursor.return_value.execute.assert_called_with("INSERT INTO dbo.NetworkLog (ServerId, IPAddress, NetworkLogDate, [Log], IncidentTypeId) VALUES( -1, '10.10.1.10', '2018-05-28 23:59:48', '2018-05-28 23:59:48 10.10.1.10 GET / Category=Files&Id=62''A=0 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1', -1 )")
    #
    def test_log_process_iis_line_with_xss_log(self):
        """ test of: log_process_iis_line, process a single xss log record. """
        from unittest.mock import patch
        with patch("pyodbc.connect") as mock_connect:
            # Set-up
            mock_connect.return_value.cursor.return_value.rowcount.return_value = 1
            # Act
            self.ld_iis.sql_server.sql_connection('mock connection string')
            count = self.ld_iis.log_process_iis_line(self.xss_log)
            print(self.ld_iis.sql_server.connection)
            print(count)
            # Assert
            mock_connect.assert_called_with('mock connection string')
            self.assertEqual(count.return_value, 1)
            mock_connect.return_value.cursor.return_value.execute.assert_called()
            mock_connect.return_value.cursor.return_value.execute.assert_called_with("INSERT INTO dbo.NetworkLog (ServerId, IPAddress, NetworkLogDate, [Log], IncidentTypeId) VALUES( -1, '10.10.1.10', '2018-05-29 00:13:44', '2018-05-29 00:13:44 10.10.1.10 GET / ReturnUrl=%3Cscript%3Ealert(%22xssvuln%22)%3C/script%3E 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1', -1 )")
    #
    def test_log_process_iis_line_with_ok_log(self):
        """ test of: log_process_iis_line, process a single log record. """
        from unittest.mock import patch
        with patch("pyodbc.connect") as mock_connect:
            # Set-up
            mock_connect.return_value.cursor.return_value.rowcount.return_value = 1
            # Act
            self.ld_iis.sql_server.sql_connection('mock connection string')
            count = self.ld_iis.log_process_iis_line(self.ok_log)
            print(self.ld_iis.sql_server.connection)
            print(count)
            # Assert
            mock_connect.assert_called_with('mock connection string')
            self.assertEqual(count, 0)
    #
    def test_log_process_load_iis_incident_types(self):
        """ test of: log_process_load_iis_incident_types, loads in a static amount of incidentType
        that go to the short description.
        """
        self.ld_iis.sql_server = sql_server.SqlServer()
        self.ld_iis.sql_server.sql_connection(
            self.ld_iis.sql_server.sql_connection_trusted_string(self.server, self.database))
        self.ld_iis.log_process_load_iis_incident_types()
        self.assertNotEqual(-1, self.ld_iis.php_inc_type)
        self.assertNotEqual(-1, self.ld_iis.sql_inc_type)
        self.assertNotEqual(-1, self.ld_iis.vs_inc_type)
        self.assertNotEqual(-1, self.ld_iis.xss_inc_type)
    #
if __name__ == '__main__':
    unittest.main()
