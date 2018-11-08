""" module: library of sql server functiuonality """
import pyodbc
#
class SqlServer(object):
    """ class: collection of sql server functiuonality (library) """
    def __init__(self):
        self.connection = object
    ##
    # sql functions
    #   sql_connection_trusted_string
    #   sql_connection
    #   sql_execute
    #   sql_fetchall
    ##
    def sql_connection_trusted_string(self, server_name, db_name):
        """ construct a sql server connection string, creation of a trusted connection,
        which does not require a user name and password.
        """
        static = 'Driver={SQL Server};Trusted_Connection=yes;'
        server = 'Server=' + server_name + ';'
        database = 'Database=' + db_name + ';'
        return static + server + database
    #
    def sql_connection_user_string(self, server_name, db_name, user, pwd):
        """ construct a sql server connection string, creation of a of a connection,
        which does requires a user name and password.
        """
        static = 'Driver={SQL Server};'
        server = 'Server=' + server_name + ';'
        database = 'Database=' + db_name + ';'
        user_pwd = 'UID=' + user + ';PWD=' + pwd + ';'
        return static + server + database + user_pwd
    #
    def sql_connection(self, connection_string):
        """ construct a sql server connection """
        self.connection = pyodbc.connect(connection_string)
        return self.connection
    #
    def sql_execute(self, sql_command):
        """ Execute sql command, create a cursor from the connection """
        count = 0
        if sql_command != '':
            cursor = self.connection.cursor()
            cursor.execute(sql_command)
            count = cursor.rowcount
            print(count, 'rows affected')
            self.connection.commit()
            cursor.close()
        else:
            print('ERROR: empty sql command string.')
        return count
    #
    def sql_fetchall(self, sql_command):
        """ get all rows for a query from a sql command """
        rows = []
        if sql_command != '':
            cursor = self.connection.cursor()
            cursor.execute(sql_command)
            rows = cursor.fetchall()
            cursor.close()
        else:
            print('ERROR: empty sql command string.')
        return rows
    #
#
