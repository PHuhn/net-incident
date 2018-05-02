using System;
using System.Configuration;
//
using NSG.Library.Helpers;
//
namespace NSG.Identity
{
    public static class Constants
    {
        // NSG.Identity.Constants
        // in FilterConfig, WebApiConfig & Startup.Auth.cs
        public static bool RequireSSL
        {
            get
            {
                return Config.GetBoolAppSettingConfigValue("Identity:RequireSSL", false );
            }
        }
        // in Startup.Auth.cs
        public static string PublicClientId = "Public-Self";
        public static string TokenEndpointPath = "/api/Token";
        public static string AuthorizeEndpointPath = "/api/Account/ExternalLogin";
        public static string ApplicationName = "WebSrv Identity";
        // in Providers.ApplicationOAuthProvider
        public static string PublicClientIdNullException = "Public Client-Id";
        public static string InvalidGrantExceptionMessage = "The user name or password is incorrect.";
        public static string UnconfirmedEmailExceptionMessage = "User did not confirm email.";
        public static string InvalidServersConfigurationExceptionMessage = "User has no 'servers/devices' configured.";
        // in Models.ApplicationDbContext
        public static string AspNetIdentityConnectionString = "NetworkIncidentConnection";
        // in AccountController
        public static string ExternalBadRequestLoginFailure = "{0} - External login failure.";
        public static string ExternalBadRequestAlreadyInUse = "{0} - The external login is already associated with an account.";
        public static string StrengthInBitsException = "{0} - strengthInBits must be evenly divisible by 8.";
        public static string ServerNotValidException = "{0} - Must have a valid 'servers/devices'.";
        // in ServerStore
        public static string UserNotFoundException = "{0} - 'user' not found: {1}";
        public static string ServerNotFoundException = "{0} - 'server/device' not found: {1}";
        public static string ServerAlreadyAssignedException = "{0} - user: {1}, 'server/device' already assigned: {2}";
        public static string UserServerNotFoundException = "{0} - user: {1}, server: {2} not found.";
        //
    }
}