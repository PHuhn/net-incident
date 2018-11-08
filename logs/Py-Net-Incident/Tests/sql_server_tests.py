"""  """
import unittest
import sql_server
import pyodbc
#
class SqlServerTests(unittest.TestCase):
    """ class: tests for sql server library """
    #
    def setUp(self):
        self.sql_server = sql_server.SqlServer()
        self.server = '.\\Express'
        self.database = 'NetIncident2'
    ##
    # sql functions
    #   sql_connection_trusted_string
    #   sql_connection
    #   sql_execute
    #   log_process_load_iis_incident_types
    #   sql_insert_network_log
    ##
    def test_sql_connection_trusted_string(self):
        """ test of: sql_connection_trusted_string, creation of a trusted connection.
        which does not require a user name and password.
        """
        conn_str = self.sql_server.sql_connection_trusted_string(self.server, self.database)
        server = 'Server=' + self.server + ';'
        database = 'Database=' + self.database + ';'
        found = False
        try:
            conn_str.index(server)
            found = True
        except ValueError:
            found = False
        self.assertEqual(True, found)
        found = False
        try:
            conn_str.index(database)
            found = True
        except ValueError:
            found = False
        self.assertEqual(True, found)
    #
    def test_sql_connection_good(self):
        """ test of: sql_connection, of one that should succeed.  If it fails it will
        throw an exception.
        """
        conn_str = self.sql_server.sql_connection_trusted_string(self.server, self.database)
        self.sql_server.sql_connection(conn_str)
    #
    def test_sql_connection_mock(self):
        """ test of: sql_connection, using a patch mock """
        from unittest.mock import patch
        with patch("pyodbc.connect") as mock_connect:
            self.sql_server.sql_connection('mock connection')
            print(self.sql_server.connection)
            mock_connect.assert_called_with('mock connection')
    #
    def test_sql_connection_bad2(self):
        """ test of: sql_connection, DatabaseError are as follows:
        DataError
        OperationalError
        IntegrityError
        InternalError
        ProgrammingError
        NotSupportedError
        """
        conn_str = self.sql_server.sql_connection_trusted_string(self.server, 'xxxx')
        try:
            self.sql_server.sql_connection(conn_str)
            self.assertEqual('-exception not raised', '')
        except pyodbc.ProgrammingError as exc:
            print(exc)
    #
    def test_sql_fetchall(self):
        """ test method: test fetchall """
        self.sql_server.sql_connection(
            self.sql_server.sql_connection_trusted_string(self.server, self.database))
        rows = self.sql_server.sql_fetchall(
            "SELECT IncidentTypeId, IncidentTypeShortDesc FROM dbo.IncidentType WHERE IncidentTypeShortDesc IN ( 'php', 'sql', 'vs', 'xss', 'dos' );")
        self.assertEqual(5, len(rows))
    #
    def test_sql_fetchall_bad(self):
        """ test method: test fetchall """
        self.sql_server.sql_connection(
            self.sql_server.sql_connection_trusted_string(self.server, self.database))
        rows = self.sql_server.sql_fetchall('')
        self.assertEqual(0, len(rows))
    #
    def test_sql_execute_bad_mock(self):
        """ test of: sql_execute, using a mock """
        from unittest.mock import patch
        with patch("pyodbc.connect") as mock_connect:
            # Set-up
            # Act
            self.sql_server.sql_connection('mock connection string')
            count = self.sql_server.sql_execute('')
            print(count)
            # Assert
            self.assertEqual(count, 0)
    # https://stackoverflow.com/questions/35143055/how-to-mock-psycopg2-cursor-object
    def test_sql_execute_mock(self):
        """ test of: sql_execute, using a mock """
        from unittest.mock import patch
        with patch("pyodbc.connect") as mock_connect:
            # Set-up
            mock_connect.return_value.cursor.return_value.rowcount.return_value = 1
            # Act
            self.sql_server.sql_connection('mock connection string')
            count = self.sql_server.sql_execute('mock command')
            print(self.sql_server.connection)
            print(count.return_value)
            # Assert
            mock_connect.assert_called_with('mock connection string')
            self.assertEqual(count.return_value, 1)
            mock_connect.return_value.cursor.return_value.execute.assert_called()
    # this takes too long to fail
    #def test_sql_connection_bad1(self):
    #    """ test of: sql_connection,
    #    """
    #    try:
    #        self.sql_server.sql_connection('.\\xxxx', self.database)
    #        self.assertEqual('-exception not raised', '')
    #    except:
    #        idx = -1
    #
    #def test_sql_execute_2_mock(self):
    #    """ test sql_execute with a mock """
    #    from unittest.mock import patch
    #    with patch("pyodbc.connect") as mock_connect:
    #        # Set-up
    #        mock_connect.return_value.cursor.return_value.rowcount.return_value = 1
    #        # Act
    #        conn = pyodbc.connect('mock connection string')
    #        cursor = conn.cursor()
    #        cursor.execute('mock command').rowcount
    #        count = cursor.rowcount
    #        conn.commit()
    #        cursor.close()
    #        print(conn)
    #        print(count.return_value)
    #        # Assert
    #        mock_connect.assert_called_with('mock connection string')
    #        self.assertEqual(count.return_value, 1)
    #        mock_connect.return_value.cursor.return_value.execute.assert_called()
    #
if __name__ == '__main__':
    unittest.main()
