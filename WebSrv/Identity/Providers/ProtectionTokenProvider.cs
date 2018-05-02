//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Owin.Security.DataProtection;
using Microsoft.AspNet.Identity.Owin;
//
using NSG.Identity;
//
namespace NSG.Identity.Providers
{
    //
    public class ProtectionTokenProvider
    {
        public static int ReturnAndInt()
        {
            return 1;
        }
        
        //
        public static DataProtectorTokenProvider<ApplicationUser> DataProtectionProvider( string tokenName )
        {
            var _provider = new DpapiDataProtectionProvider(NSG.Identity.Constants.ApplicationName);
            return new DataProtectorTokenProvider<ApplicationUser>(
                _provider.Create( tokenName ))
                    {
                        TokenLifespan = TimeSpan.FromDays(2)
                    };
        }
        //
    }
}
//
