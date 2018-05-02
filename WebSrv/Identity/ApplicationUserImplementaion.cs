using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Data.Entity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
//
using NSG.Identity.Incidents;
//
namespace NSG.Identity
{
    //
    // Contains:
    //  ApplicationUser,
    //  ApplicationUserStore,
    //  ApplicationUserManager.
    //
    // Must be expressed in terms of our custom Role and other types:
    public class ApplicationUser
        : IdentityUser<string, ApplicationUserLogin,
            ApplicationUserRole, ApplicationUserClaim>
    {
        //
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }
        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }
        [Required]
        [MaxLength(16)]
        public string UserNicName { get; set; }
        [Required]
        public int CompanyId { get; set; }
        [Required]
        public DateTime CreateDate { get; set; }
        //
        [ForeignKey("CompanyId")]
        public virtual Company Company { get; set; }
        //
        public virtual ICollection<ApplicationServer> Servers { get; set; }
        //
        public ApplicationUser()
        {
            this.Id = Guid.NewGuid().ToString();
        }

        // ** Add authenticationtype as method parameter:
        public async Task<ClaimsIdentity>
            GenerateUserIdentityAsync(ApplicationUserManager manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

    }
    //
    // Most likely won't need to customize these either, but they were needed because we implemented
    // custom versions of all the other types:
    public class ApplicationUserStore
        : UserStore<ApplicationUser, ApplicationRole, string,
            ApplicationUserLogin, ApplicationUserRole,
            ApplicationUserClaim>, IUserStore<ApplicationUser, string>,
            IDisposable
    {
        public ApplicationUserStore()
            : this(new IdentityDbContext())
        {
            base.DisposeContext = true;
        }

        public ApplicationUserStore(DbContext context)
            : base(context)
        {
        }
    }
    //
    public class ApplicationUserManager
        : UserManager<ApplicationUser, string>
    {
        public ApplicationUserManager(IUserStore<ApplicationUser, string> store)
            : base(store)
        {
        }

        public static ApplicationUserManager Create(
            IdentityFactoryOptions<ApplicationUserManager> options,
            IOwinContext context)
        {
            var manager = new ApplicationUserManager(
                new UserStore<ApplicationUser, ApplicationRole, string,
                    ApplicationUserLogin, ApplicationUserRole,
                    ApplicationUserClaim>(context.Get<ApplicationDbContext>()));

            // Configure validation logic for usernames
            manager.UserValidator = new UserValidator<ApplicationUser>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };
            // Configure validation logic for passwords
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 8,
                RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };
            // wire-up emailing
            manager.EmailService = new EmailService();
            //
            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider =
                    new DataProtectorTokenProvider<ApplicationUser>(
                        dataProtectionProvider.Create("WebSrv Identity"));
            }
            return manager;
        }
    }
    //
}