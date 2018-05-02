//
using System;
using Microsoft.AspNet.Identity.EntityFramework;
//
namespace NSG.Identity
{
    // You will not likely need to customize there, but it is necessary/easier to create our own 
    // project-specific implementations, so here they are:
    public class ApplicationUserLogin : IdentityUserLogin<string> { }
    public class ApplicationUserClaim : IdentityUserClaim<string> { }
    // This is the UserId and RoleId table...
    public class ApplicationUserRole : IdentityUserRole<string> { }
}
//
