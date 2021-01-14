<#
.SYNOPSIS
	This is a simple Powershell script to load NetGear abuse logs.

.DESCRIPTION
	This is a simple Powershell script to load NetGear abuse logs.

.EXAMPLE
	PS> .\LogsLoad-NG.ps1 -server ".\Express" -dbName "NetIncident2" -filePath "C:\Temp\abuse.txt" -serverId 1 -incidentTypeId 5

.EXAMPLE
	PS> .\LogsLoad-NG.ps1 -filePath "C:\Temp\abuse.txt" -serverId 1 -incidentTypeId 5

.PARAMETER	server
		SQL Server instance name, . can be used for local instance or .\SQLExpress for default instance name for Express version.

.PARAMETER	dbName
		database name,

.PARAMETER	filePath
		Full path and file namefile,

.PARAMETER	serverId
		An integer value of the server logs are being loaded, 

.PARAMETER	incidentTypeId
		An integer value of the type of incident being loaded

.NOTES
	This load one specific type of logs for one server.

.LINK
	https://github.com/PHuhn/

#>

param( [string]$server = ".\SQLExpress", [string]$dbName = "NetIncident2", [string]$filePath = "", [int]$serverId = -1, [int]$incidentTypeId = -1 )
#
# ============================================================================
#    By: Phil Huhn
#  Date: 2018-05-03
# Versions:
#  1.0.0	basic pasting script
#  1.0.1	Fixed connection on loop
# ============================================================================
### functions section ###
##
function log-LoadLogs ( [string]$server, [string]$dbName, [string]$filePath, [int]$serverId, [int]$incidentTypeId )
{
	# Write-Host "server:" $server " dbName:" $dbName " Path:" $filePath " Srv:" $serverId " Type:" $incidentTypeId
	$connection = sql-GetOpenConnection $server $dbName
	$reader = [System.IO.File]::OpenText( $filePath )
	try {
		for(;;) {
			$line = $reader.ReadLine()
			if ($line -eq $null) { break }
			# process the line
 			log-ProcessLog $connection $serverId $incidentTypeId $line
		}
	}
	finally {
		$reader.Close()
		$Connection.Close()
	}
}
##
# Sample NetGear log:
# [DoS attack: FIN Scan] attack packets in last 20 sec from ip [63.251.98.12], Thursday, May 03,2018 05:46:58
# [DoS attack: RST Scan] from source: 18.133.222.27:443, Monday, November 09,2020 12:16:28       


##
function log-ProcessLog ( $connection, [int]$serverId, [int]$incidentTypeId, [string]$log ) {
	if( $log -ne "" )
	{
		$ip = ""
		$date = ""
		# process the line
		$text = $log.split(",")
		if( $text.Length -gt 2 ) {
			$ipAddress = $text[0].split(":")[2].Trim()
		}
		if( $text.Length -gt 2 ) {
			$mth = $text[2]
			$tim = $text[3].Trim()
			$networkLogDate = "$mth, $tim" # concatentate
		}
		log-SqlInsertNetworkLog $connection $serverId $incidentTypeId $ipAddress $networkLogDate $log
	}
}
##
# INSERT INTO dbo.NetworkLog (ServerId, IPAddress, NetworkLogDate, [Log], IncidentTypeId) VALUES ( )
function log-SqlInsertNetworkLog ( $connection, [int]$serverId, [int]$incidentTypeId, [string]$ipAddress, [string]$networkLogDate, [string]$log ) {
	if( $log -ne "" -and $ipAddress -ne "" -and $networkLogDate -ne "" ) {
		# Write-Host $serverId $incidentTypeId $ipAddress $networkLogDate $log
		$sqlCommand = "INSERT INTO dbo.NetworkLog (ServerId, IPAddress, NetworkLogDate, [Log], IncidentTypeId) VALUES ( $serverId, '$ipAddress', '$networkLogDate', '$log', $incidentTypeId )"
		Write-Host $sqlCommand
		sql-ExecNonQuery $connection $sqlCommand
	}
}
##
#
#	SQL Server set of functions
##
function sql-ConStr ( [string]$server, [string]$database )
{
	$connectionString = "server='$server'; database='$database'; trusted_connection=true;"
 return $connectionString
}
##
function sql-GetOpenConnection ( [string]$server, [string]$database )
{
	$connection = New-Object System.Data.SQLClient.SQLConnection
	try
	{
		$connection.ConnectionString = sql-ConStr $server $database
		$connection.Open()
	}
	finally
	{ }
 return $connection
}
##
function sql-ExecNonQuery ( $connection, [string]$sqlCommand )
{
 $return = 0
	try
	{
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
function sql-ExecScalar ( $connection, [string]$sqlCommand )
{
 $return = 0
	try
	{
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
function sql-ExecDataSet ( $connection, [string]$sqlCommand )
{
 $dataSet = New-Object System.Data.DataSet
	try
	{
		$Command = New-Object System.Data.SQLClient.SQLCommand
		$Command.Connection = $connection
		$Command.CommandText = $sqlCommand
		$sqlAdapter = New-Object System.Data.SqlClient.SqlDataAdapter
		$sqlAdapter.SelectCommand = $Command
		$sqlAdapter.Fill($dataSet)
	}
	finally
	{ }
 return $dataSet
}
#
### end-of-functions-section ###
# ============================================================================
  ### main section, this will receive the 1st line's parameters ###
  # set default values...
  $varArray = @("server=$server", "dbName=$dbName", "$filePath=$filePath", "serverId=$serverId", "incidentTypeId=$incidentTypeId")
  Write-Host $varArray
  if( $server -ne "" -and $dbName -ne "" -and $filePath -ne "" -and $serverId -ne -1 -and $incidentTypeId -ne -1) {
    #
    log-LoadLogs $server $dbName $filePath $serverId $incidentTypeId
    #
  } else {
    # Error, missing parameter value
    Write-Host ""
    Write-Host "All parameters require a value."
  }
  ### end-of-main-section ###
# end-of-script
