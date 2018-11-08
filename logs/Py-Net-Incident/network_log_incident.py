""" module: structure of data to be written to database """
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
            sql_values = "VALUES( {0}, '{1}', '{2}', '{3}', {4} )".format(self.server_id, self.ip_address, self.network_log_date, self.log, self.incident_type)
            sql_command = 'INSERT INTO dbo.NetworkLog (ServerId, IPAddress, NetworkLogDate, [Log], IncidentTypeId) ' + sql_values
            print(sql_values)
        else:
            print('ERROR: bad ip or date: ', self.log)
        return sql_command
#
