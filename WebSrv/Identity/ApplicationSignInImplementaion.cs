using System;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.Owin;
using System.Security.Claims;
using Microsoft.Owin.Security;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
//
namespace NSG.Identity
{
    //
    // add the following to startup.auth.cs:
    //  app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);
    // and:
    //  app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);
    public class ApplicationSignInManager : SignInManager<ApplicationUser, string>
    {
        public ApplicationSignInManager(ApplicationUserManager userManager, IAuthenticationManager authenticationManager) :
            base(userManager, authenticationManager)
        { }

        public override Task<ClaimsIdentity> CreateUserIdentityAsync(ApplicationUser user)
        {
            // ????
            // for oAuth ClaimsIdentity use OAuthDefaults.AuthenticationType
            // for cookie ClaimsIdentity use CookieAuthenticationDefaults.AuthenticationType
            return user.GenerateUserIdentityAsync(
                (ApplicationUserManager)UserManager, CookieAuthenticationDefaults.AuthenticationType);
        }

        public static ApplicationSignInManager Create(IdentityFactoryOptions<ApplicationSignInManager> options, IOwinContext context)
        {
            return new ApplicationSignInManager(context.GetUserManager<ApplicationUserManager>(), context.Authentication);
        }
    }
}
//
