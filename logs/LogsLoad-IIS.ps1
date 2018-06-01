<#
.SYNOPSIS
	This is a simple Powershell script to load some IIS abuse logs.

.DESCRIPTION
	This reads the complete flat log file from an IIS server and filters for specific vulnerabilities on url line, and writes directly to the database table.
	Example vulnerabilities:
	*	SQL injection
	*	PHP
	*	Cross site scrripting (XSS)
	The IIS log files are by default in GMT and recycle to the next day at midnight GMT.  Format of the date-time stamp can be changed (just google it).  So, one could setup a schedule tasks (cron job) to process the files (taking in account when the logs are cycled to the next day).

.EXAMPLE
	PS> .\LogsLoad-IIS.ps1 -server ".\Express" -dbName "NetIncident2" -filePath "C:\inetpub\logs\LogFiles\W3SVC1\u_ex180529.log" -serverId 1

.EXAMPLE
	PS> .\LogsLoad-IIS.ps1 -filePath "C:\inetpub\logs\LogFiles\W3SVC1\u_ex180529.log" -serverId 1

.PARAMETER	server
	SQL Server instance name, . can be used for local instance or .\SQLExpress for default instance name for Express version.

.PARAMETER	dbName
	Database name,

.PARAMETER	filePath
	Full path and file name,

.PARAMETER	serverId
	An integer value of the server logs that are being loaded, 

.NOTES
	This load specific incident types of logs for one server.

.INPUTS
	flat log files: filePath (full path and file name passed as a parameter),

	database table: dbo.IncidentType (in dbName, on server)

.OUTPUTS
	to table:
		dbo.NetworkLogs,
	in dbName (database name passed as a parameter),
	on server (SQL Server instance name passed as a parameter)

.LINK
	https://github.com/PHuhn/

#>

param( [string]$server = ".\SQLExpress", [string]$dbName = "NetIncident2", [string]$filePath = "", [int]$serverId = -1 )
#
# ============================================================================
#   By: Phil Huhn
# Date: 2018-05-29
# Versions:
#  1.0.0	basic intial script
# ============================================================================
### functions section ###
##
function log-LoadLogs ( [string]$server, [string]$dbName, [string]$filePath, [int]$serverId ) {
	# Write-Host "server:" $server " dbName:" $dbName " Path:" $filePath " Srv:" $serverId " Type:" $incidentTypeId
	$connectionString = sql-ConStr $server $dbName
	$incidentTypes = sql-ExecDataSet2 $connectionString "SELECT IncidentTypeId, IncidentTypeShortDesc FROM dbo.IncidentType"
	#
	Foreach($Row in $incidentTypes.tables[0].rows) {
		switch ( $Row["IncidentTypeShortDesc"].ToLower() ) {
			'php' { $phpIncTypeId = $Row["IncidentTypeId"] }
			'sql' { $sqlIncTypeId = $Row["IncidentTypeId"] }
			'vs'  { $vsIncTypeId = $Row["IncidentTypeId"] }
			'xss' { $xssIncTypeId = $Row["IncidentTypeId"] }
		}
	}
	#
	# Write-Host $phpIncTypeId $sqlIncTypeId $vsIncTypeId $xssIncTypeId
	#
	$reader = [System.IO.File]::OpenText( $filePath )
	try {
		for(;;) {
			$line = $reader.ReadLine()
			if ( $line -eq $null ) { break }
			if ( $line.Substring(0,1) -ne "#" -and $nine -ne "" ) {
				# process the line
 				log-Process-PHP-Log $connectionString $serverId $phpIncTypeId $line
 				log-Process-SQL-Log $connectionString $serverId $sqlIncTypeId $line
 				log-Process-XSS-Log $connectionString $serverId $xssIncTypeId $line
			}
		}
	}
	finally {
		$reader.Close()
		# $Connection.Close()
	}
}
##
# Sample IIS log:
# 2018-05-29 00:11:44 10.10.1.10 GET / -dallow_url_include=on+-dauto_prepend_file=php://input 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1
##
function log-Process-PHP-Log ( [String]$connectionString, [int]$serverId, [int]$incidentTypeId, [string]$log ) {
	$columns = $log.Split(" ")
	if( $columns[5] -like "*allow_url_include=on*" -and $columns[5] -like "*auto_prepend_file=php*" )
	{
		log-Process-Log $connectionString $serverId $incidentTypeId $log
	}
}
##
# Sample IIS log:
# 2018-05-28 23:59:48 10.10.1.10 GET / Category=Files&Id=62'A=0 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1
##
function log-Process-SQL-Log ( [String]$connectionString, [int]$serverId, [int]$incidentTypeId, [string]$log ) {
	$columns = $log.Split(" ")
	if( $columns[5] -like "*'*" -or $columns[5] -like "*--*" )
	{
		log-Process-Log $connectionString $serverId $incidentTypeId $log
	}
}
##
# Sample IIS log:
# 2018-05-29 00:13:44 10.10.1.10 GET / ReturnUrl=%3Cscript%3Ealert(%22xssvuln%22)%3C/script%3E 80 - 10.10.1.10 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/64.0.3282.140+Safari/537.36+Edge/17.17134 - 200 0 0 1
##
function log-Process-XSS-Log ( [String]$connectionString, [int]$serverId, [int]$incidentTypeId, [string]$log ) {
	$columns = $log.Split(" ")
	if( $columns[5] -like "*%3Cscript%3E*" -and $columns[5] -like "*%3C/script%3E*" )
	{
		log-Process-Log $connectionString $serverId $incidentTypeId $log
	}
}
##
# log is to be written, parse and write to NetworkLogs.
##
function log-Process-Log ( [String]$connectionString, [int]$serverId, [int]$incidentTypeId, [string]$log ) {
	$columns = $log.Split(" ")
	$dat = $columns[0]
	$tim = $columns[1]
	$ipAddress = $columns[2]
	$networkLogDate = "$dat $tim"
	$log = $log.Replace("'","''")
	log-SqlInsertNetworkLog $connectionString $serverId $incidentTypeId $ipAddress $networkLogDate $log
}
##
# INSERT INTO dbo.NetworkLog (ServerId, IPAddress, NetworkLogDate, [Log], IncidentTypeId) VALUES ( )
##
function log-SqlInsertNetworkLog ( [String]$connectionString, [int]$serverId, [int]$incidentTypeId, [string]$ipAddress, [string]$networkLogDate, [string]$log ) {
	if( $log -ne "" -and $ipAddress -ne "" -and $networkLogDate -ne "" ) {
		# Write-Host $serverId $incidentTypeId $ipAddress $networkLogDate $log
		$sqlCommand = "INSERT INTO dbo.NetworkLog (ServerId, IPAddress, NetworkLogDate, [Log], IncidentTypeId) VALUES ( $serverId, '$ipAddress', '$networkLogDate', '$log', $incidentTypeId )"
		Write-Host $sqlCommand
		sql-ExecNonQuery2 $connectionString $sqlCommand
	}
}
##
# ============================================================================
# SQL Server set of functions
##
# Construct a connection string
##
function sql-ConStr ( [string]$server, [string]$database ) {
	return "server='$server'; database='$database'; trusted_connection=true;"
}
##
# Create an open connection
##
function sql-GetOpenConnection ( [string]$server, [string]$database ) {
	$connection = New-Object System.Data.SQLClient.SQLConnection
	try {
		$connection.ConnectionString = sql-ConStr $server $database
		$connection.Open( )
	}
	finally
	{ }
 return $connection
}
##
# Execute a SQL query that does not return a value (create/update/delete)
##
function sql-ExecNonQuery ( [System.Data.SQLClient.SQLConnection]$connection, [string]$sqlCommand ) {
 $return = 0
	try {
		$Command = New-Object System.Data.SQLClient.SQLCommand
		$Command.Connection = $connection
		$Command.CommandText = $sqlCommand
		$return = $Command.ExecuteNonQuery()
	}
	finally
	{ }
 return $return
}
##
# Execute a SQL query that does not return a value (create/update/delete)
##
function sql-ExecNonQuery2 ( [string]$connectionString, [string]$sqlCommand ) {
 $return = 0
	try {
		$connection = New-Object System.Data.SQLClient.SQLConnection
		$connection.ConnectionString = $connectionString
		$connection.Open( )
		#
		$Command = New-Object System.Data.SQLClient.SQLCommand
		$Command.Connection = $connection
		$Command.CommandText = $sqlCommand
		$return = $Command.ExecuteNonQuery()
		$connection.Close( )
	}
	finally
	{ }
 return $return
}
##
# Return a scalar/single, passing an open connection 
##
function sql-ExecScalar ( [System.Data.SQLClient.SQLConnection]$connection, [string]$sqlCommand ) {
 $return = 0
	try {
		$Command = New-Object System.Data.SQLClient.SQLCommand
		$Command.Connection = $connection
		$Command.CommandText = $sqlCommand
		$return = $Command.ExecuteScalar()
	}
	finally
	{ }
 return $return
}
##
# Return a data-set, passing an open connection 
##
function sql-ExecDataSet ( [System.Data.SQLClient.SQLConnection]$connection, [string]$sqlCommand ) {
 $dataSet = New-Object System.Data.DataSet
	try {
		$Command = New-Object System.Data.SQLClient.SQLCommand
		$Command.Connection = $connection
		$Command.CommandText = $sqlCommand
		#
		$sqlAdapter = New-Object System.Data.SqlClient.SqlDataAdapter
		$sqlAdapter.SelectCommand = $Command
		$sqlAdapter.Fill($dataSet)
	}
	finally
	{ }
 return $dataSet
}
##
# Return a data-set, passing a connection string
##
function sql-ExecDataSet2 ( [string]$connectionString, [string]$sqlCommand ) {
 $dataSet = New-Object System.Data.DataSet
	# Write-Host "LogsLoad-IIS.sql-ExecDataSet2 entering ..."
	try {
		$connection = New-Object System.Data.SQLClient.SQLConnection
		$connection.ConnectionString = $connectionString

		$Command = New-Object System.Data.SQLClient.SQLCommand
		$Command.Connection = $connection
		$Command.CommandText = $sqlCommand

		$sqlAdapter = New-Object System.Data.SqlClient.SqlDataAdapter
		$sqlAdapter.SelectCommand = $Command
		$sqlAdapter.Fill($dataSet)
	}
	finally
	{ }
	#
	# Write-Host "LogsLoad-IIS.sql-ExecDataSet2 exiting ..."
 return $dataSet
}
#
### end-of-functions-section ###
# ============================================================================
  ### main section, this will valid the parameters passed ###
  $varArray = @("LogsLoad-IIS.main: server=$server", "dbName=$dbName", "$filePath=$filePath", "serverId=$serverId")
  Write-Host $varArray
  if( $server -ne "" -and $dbName -ne "" -and $filePath -ne "" -and $serverId -ne -1 ) {
    # valid
    log-LoadLogs $server $dbName $filePath $serverId
    #
  } else {
    # Error, missing parameter value
    Write-Host ""
    Write-Host "All parameters require a value."
  }
  ### end-of-main-section ###
# end-of-script
