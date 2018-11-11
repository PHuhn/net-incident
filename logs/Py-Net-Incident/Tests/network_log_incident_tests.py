""" module: for network log incident """
import unittest
import logs_load
#
class NetworkLogIncidentTests(unittest.TestCase):
    """ class: for network log incident """
    #
    def setUp(self):
        self.net_log_inc = object
    #
    def test_network_log_incident_set(self):
        """ method: for testing network log incident creation """
        self.net_log_inc = logs_load.NetworkLogIncident(
            8, 1000, '10.10.1.10', '2018-11-07 11:11:59', 'log message')
        self.assertEqual(8, self.net_log_inc.server_id)
        self.assertEqual(1000, self.net_log_inc.incident_type)
        self.assertEqual('10.10.1.10', self.net_log_inc.ip_address)
        self.assertEqual('2018-11-07 11:11:59', self.net_log_inc.network_log_date)
        self.assertEqual('log message', self.net_log_inc.log)
    #
    def test_sql_insert_network_log_string(self):
        """ method: for testing creation of sql insert from a network log incident """
        self.net_log_inc = logs_load.NetworkLogIncident(
            8, 1000, '10.10.1.10', '2018-11-07 11:11:59', 'log message')
        self.assertEqual("INSERT INTO dbo.NetworkLog (ServerId, IPAddress, NetworkLogDate, " + \
            "[Log], IncidentTypeId) VALUES( 8, '10.10.1.10', '2018-11-07 11:11:59', " + \
            "'log message', 1000 )", self.net_log_inc.sql_insert_network_log_string())
    #
if __name__ == '__main__':
    unittest.main()
