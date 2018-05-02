using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
//
using NSG.Library;
//
// https://stackoverflow.com/questions/1469764/run-command-prompt-commands
//
namespace WebSrv.Helpers
{
    public static partial class Helpers
    {
        //
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ip">IP address</param>
        /// <returns>string of text with ping data</returns>
        public static string PingAddress(string ip)
        {
            return IpAddressCommand(ip,
                NSG.Library.Helpers.Config.GetStringAppSettingConfigValue("Services:PingDir", @"C:\"),
                NSG.Library.Helpers.Config.GetStringAppSettingConfigValue("Services:PingCmd", "ping -n 2 -a {0}"));
        }
        //
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ip">IP address</param>
        /// <returns>string of text with who-is data</returns>
        public static string WhoIs(string ip)
        {
            string _whois = IpAddressCommand(ip,
                NSG.Library.Helpers.Config.GetStringAppSettingConfigValue("Services:WhoisDir", @"C:\"),
                NSG.Library.Helpers.Config.GetStringAppSettingConfigValue("Services:WhoisCmd", "jwhois {0}"));
            string _link = WhoIsLink(_whois);
            if( _link != "" )
                return IpAddressCommand(_link,
                    NSG.Library.Helpers.Config.GetStringAppSettingConfigValue("Services:WhoisDir", @"C:\"),
                    NSG.Library.Helpers.Config.GetStringAppSettingConfigValue("Services:WhoisCmd", "jwhois {0}"));
            return _whois;
        }
        //
        static string IpAddressCommand(string ip, string dir, string command)
        {
            string _return = "";
            if (ip != "")
            {
                ip = ip.Trim();
                if (ip.Substring(0, 1).CompareTo("9") < 1 || ip.Substring(0, 3).ToLower() == "net" )
                {
                    string _cmdText = String.Format(command, ip);
                    _return = NSG.Library.Helpers.OS.CallOperatingSystemCmd(_cmdText, dir);
                }
            }
            return _return;
        }
        //
        /// <summary>
        /// link code
        /// </summary>
        /// <param name="whoisData"></param>
        /// <returns>string of ip address or empty</returns>
        public static string WhoIsLink(string whoisData)
        {
            string _link = "";
            bool _processFlag = true;
            string _nic = "";
            foreach (string _line in whoisData.Split(new[] { '\r', '\n' }))
            {
                if (_processFlag && _line.Length > 3 && ( _line.Substring(0, 1) != "#" && _line.Substring(0, 1) != "%"))
                {
                    if( _line.Substring( 0, 1 ) == "[" )
                    {
                        // whois. and jwhois.
                        int _pos = _line.IndexOf( "whois." );
                        if( _pos == -1 )
                        {
                            // [vault.krypt.com] length is the same!
                            _pos = _line.IndexOf( "vault." );
                        }
                        if( _pos > -1 )
                        {
                            string[] parts = _line.Substring( _pos ).Split( '.' );
                            _nic = _line.Substring( _pos+6, _line.IndexOf( "]" ) - ( _pos+6 ) );
                        }
                    }
                    // System.Diagnostics.Debug.WriteLine(_line);
                    if (_line.Substring(0, 8).ToLower() == "netname:")
                        return "";
                    else
                    {
                        string[] _a1 = _line.Split('(');
                        if( _a1.Length > 1 )
                        {
                            string[] _a2 = _a1[1].Split(')');
                            if (_a2.Length > 1)
                            {
                                if (_a2[0].Substring(0, 3) == "NET")
                                {
                                    _link = _a2[0];
                                    System.Diagnostics.Debug.WriteLine(_nic + " : " + _link);
                                    return _link;
                                }
                            }
                        }
                    }
                }
            }
            return _link;
        }
    }
}
/*
[Querying whois.arin.net]
[whois.arin.net]

#
# ARIN WHOIS data and services are subject to the Terms of Use
# available at: https://www.arin.net/whois_tou.html
#
# If you see inaccuracies in the results, please report at
# https://www.arin.net/public/whoisinaccuracy/index.xhtml
#
#
# The following results may also be obtained via:
# https://whois.arin.net/rest/nets;q=174.79.60.55?showDetails=true&showARIN=false&showNonArinTopLevelNet=false&ext=netref2
#

Cox Communications NETBLK-PH-CBS-174-79-32-0 (NET-174-79-32-0-1) 174.79.32.0 - 174.79.63.255
Cox Communications Inc. CXA (NET-174-64-0-0-1) 174.64.0.0 - 174.79.255.255

#
# ARIN WHOIS data and services are subject to the Terms of Use
# available at: https://www.arin.net/whois_tou.html
#
# If you see inaccuracies in the results, please report at
# https://www.arin.net/public/whoisinaccuracy/index.xhtml
#
==== awk code ==========================================================
BEGIN{ lnk=""; flg=1; }
{
  if( flg == 1 && ( $1 == "NetName:" || $1 == "netname:" ) ) flg=0;
  if( flg == 1 && $1 != "#" ) {
    if( NF != 0 &&  lnk == "" ) {
      split( $0, n, "(" );
      split( n[2], n, ")" );
      lnk = n[1];
    }
  }
}
END { 
  if( lnk == "" ) lnk = "X";
  print lnk;
}

*/