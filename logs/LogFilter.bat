@REM Take raw log files an extract out concerning ones.
@REM
 @REM input the file name without the txt extent
 @IF "X%1" == "X" GOTO END
 @SET inp=%1.txt
 @IF NOT EXIST %inp% GOTO NOTFOUND
 @REM
 @REM ignore [Service blocked: ICMP_echo_req] not illegal ...
 grep -E "^\[admin login" %inp% > %1%-admin.txt
 grep -vE "^\[DHCP IP: \(192.168|^\[Service blocked: ICMP_echo_req|^\[Time synchronized|^\[Internet connected|^\[Internet disconnected|^\[admin login|^\[Initialized, firmware|^\[Log Cleared" %inp% > %1%-probe.txt
 @REM
 TYPE %1%-admin.txt
 TYPE %1%-probe.txt
@GOTO END
:NOTFOUND
 @ECHO %inp% Not Found 
:END

