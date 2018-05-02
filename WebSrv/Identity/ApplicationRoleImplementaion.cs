//
using System;
using System.Linq;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
//
namespace NSG.Identity
{
    //
    // Contains:
    //  ApplicationRole,
    //  ApplicationRoleStore,
    //  ApplicationRoleManager.
    //
    // Must be expressed in terms of our custom UserRole:
    public class ApplicationRole : IdentityRole<string, ApplicationUserRole>
    {
        public ApplicationRole()
        {
            this.Id = Guid.NewGuid().ToString();
        }

        public ApplicationRole(string name)
            : this()
        {
            this.Name = name;
        }
        //
        /// <summary>
        /// 2 parameter constructror
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <remarks>Not normally a constructor</remarks>
        public ApplicationRole(string id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
        //
    }
    //
    public class ApplicationRoleStore
        : RoleStore<ApplicationRole, string, ApplicationUserRole>,
            IQueryableRoleStore<ApplicationRole, string>,
            IRoleStore<ApplicationRole, string>, IDisposable
    {
        public ApplicationRoleStore()
            : base(new IdentityDbContext())
        {
            base.DisposeContext = true;
        }

        public ApplicationRoleStore(DbContext context)
            : base(context)
        {
        }
    }
    //
    public class ApplicationRoleManager : RoleManager<ApplicationRole>
    {
        // single parameter of role store
        public ApplicationRoleManager(IRoleStore<ApplicationRole, string> roleStore)
            : base(roleStore)
        {
        }
        // 2 parameters of options and http owin context
        public static ApplicationRoleManager Create(
            IdentityFactoryOptions<ApplicationRoleManager> options,
            IOwinContext context)
        {
            return new ApplicationRoleManager(
                new ApplicationRoleStore(context.Get<ApplicationDbContext>()));
        }
    }
    //
}
//