@REM fake-smtp-server is a nodejs application
@REM
@REM Usage:
@REM   fake-smtp-server [OPTIONS] [ARGS]
@REM
@REM Options: 
@REM   -s, --smtp-port [NUMBER] SMTP port to listen on (Default is 1025)
@REM   -h, --http-port [NUMBER] HTTP port to listen on (Default is 1080)
@REM   -w, --whitelist STRING Only accept e-mails from these adresses. 
@REM                          Accepts multiple e-mails comma-separated.
@REM   -m, --max [NUMBER]     Max number of e-mails to keep (Default is 10)
@REM   -a, --auth [String]    Authentication details in USERNAME:PASSWORD format
@REM Ports of 25, 465 or 587 (unencryped/SSL/TSL)
fake-smtp-server --smtp-port 25 --http-port 10080 --max 10
@REM
@REM You can filter emails with the following parameters:
@REM	from: filter sender
@REM	to: filter recipient
@REM	since: filter email date
@REM	until: filter email date
@REM Example:
@REM
@REM	GET http://localhost:1080/api/emails?from=joe@example.com&to=bob@example.com&since=2017-09-18T12:00:00Z&until=2017-09-19T00:00:00Z
@REM Removing all received email
@REM To remove all emails without restarting the server:
@REM	DELETE http://localhost:1080/api/emails
