using System;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.OAuth;
using Owin;
//
using NSG.Identity.Providers;
using NSG.Identity.Incidents;
using System.Web.Http.Cors;
using System.Web.Cors;
using Microsoft.Owin.Cors;
using System.Threading.Tasks;
//
namespace NSG.Identity
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }
        //
        public static string PublicClientId { get; private set; }
        //
        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context and user manager to use a single instance per request
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationRoleManager>(ApplicationRoleManager.Create);
            app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);
            app.CreatePerOwinContext<ApplicationServerManager>(ApplicationServerManager.Create);
            //
            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);
            //
            // Configure the application for OAuth based flow
            PublicClientId = Constants.PublicClientId;
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString(Constants.TokenEndpointPath),
                AuthorizeEndpointPath = new PathString(Constants.AuthorizeEndpointPath),
                AccessTokenExpireTimeSpan = TimeSpan.FromHours(4),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AllowInsecureHttp = true
            };
            //
            // Token Generation
            UseOwinCorsOrigins( app );
            app.UseOAuthAuthorizationServer(OAuthOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
            //
            // Enable the application to use bearer tokens to authenticate users
            // app.UseOAuthBearerTokens(OAuthOptions);
            //
            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //    consumerKey: "",
            //    consumerSecret: "");

            //app.UseFacebookAuthentication(
            //    appId: "",
            //    appSecret: "");

            //app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            //{
            //    ClientId = "",
            //    ClientSecret = ""
            //});
        }
        //
        /// <summary>
        /// taken from http://benfoster.io/blog/aspnet-webapi-cors
        /// do a more discrete cors instead of allow-all. 
        /// </summary>
        /// <param name="app">injected IAppBuilder</param>
        public void UseOwinCorsOrigins(IAppBuilder app)
        {
            var corsPolicy = new CorsPolicy
            {
                AllowAnyMethod = true,
                AllowAnyHeader = true
            };
            // Try and load allowed origins from web.config.  If none are
            // configured then allow all origins.
            const string _keyCorsAllowOrigin = "cors:allowOrigins";
            string _origins = NSG.Library.Helpers.Config.GetStringAppSettingConfigValue(_keyCorsAllowOrigin, "");
            if (_origins == "")
            {
                corsPolicy.AllowAnyOrigin = true;
            }
            else
            {
                foreach (var _origin in _origins.Split(','))
                {
                    corsPolicy.Origins.Add(_origin);
                }
            }
            //
            var corsOptions = new Microsoft.Owin.Cors.CorsOptions
            {
                PolicyProvider = new CorsPolicyProvider
                {
                    PolicyResolver = context => Task.FromResult(corsPolicy)
                }
            };
            //
            app.UseCors(corsOptions);
        }
    }
}
