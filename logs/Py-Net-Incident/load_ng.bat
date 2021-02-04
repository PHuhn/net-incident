@REM Take raw log files an extract out concerning ones and load them.
@REM
 @REM input the file name without the txt extent
 @IF "X%1" == "X" GOTO END
 @SET inp=%1.txt
 @IF NOT EXIST ..\%inp% GOTO NOTFOUND
 @REM
 @REM usage: logs_load.py [-h]
 @REM                     --logType log_type (of NG NGR or IIS)
 @REM                     [--server server (.\SQLExpress)]
 @REM                     [--dbName db_name (NetIncident2)]
 @REM                     --filePath file_path
 @REM                     --serverId server_id
 @REM
 python logs_load.py --logType NGR --server .\Express --serverId 4 --filePath ..\%inp%
 @REM
@GOTO END
:NOTFOUND
 @ECHO %inp% Not Found 
:END

