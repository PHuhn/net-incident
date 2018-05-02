using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.DataProtection;
//
using NSG.Identity;
using NSG.Identity.Api;
using NSG.Identity.Models;
using NSG.Identity.Incidents;
using NSG.Identity.Providers;
//
namespace WebSrv.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UsersAdminController : BaseController
    {
        public UsersAdminController() : base()
        {
        }
        //
        public UsersAdminController(ApplicationUserManager userManager,
            ApplicationRoleManager roleManager) : base()
        {
            UserManager = userManager;
            RoleManager = roleManager;
        }
        //
        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        private ApplicationRoleManager _roleManager;
        public ApplicationRoleManager RoleManager
        {
            get
            {
                return _roleManager ?? HttpContext.GetOwinContext().Get<ApplicationRoleManager>();
            }
            private set
            {
                _roleManager = value;
            }
        }
        private ApplicationServerManager _serverManager;
        public ApplicationServerManager ServerManager
        {
            get
            {
                return _serverManager ?? Request.GetOwinContext().Get<ApplicationServerManager>();
            }
            private set { _serverManager = value; }
        }
        //
        /// <summary>
        /// GET: /Users/
        /// </summary>
        /// <returns>View of a list of users</returns>
        public async Task<ActionResult> Index()
        {
            return View(await UserManager.Users.ToListAsync());
        }
        //
        /// <summary>
        /// GET: /Users/Details/5
        /// </summary>
        /// <param name="id">guid of a user</param>
        /// <returns>a single application user</returns>
        public async Task<ActionResult> Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = await UserManager.FindByIdAsync(id);

            ViewBag.RoleNames = await UserManager.GetRolesAsync(user.Id);
            ViewBag.ServerNames = user.Servers.Select(s => s.ServerShortName).ToArray();

            return View(user);
        }
        //
        /// <summary>
        /// GET: /Users/Create
        /// </summary>
        /// <returns>a view containing a list of roles</returns>
        public async Task<ActionResult> Create()
        {
            //Get the list of Roles
            ViewBag.RoleId = new SelectList(await RoleManager.Roles.ToListAsync(), "Name", "Name");
            return View();
        }

        //
        // POST: /Users/Create
        [HttpPost]
        public async Task<ActionResult> Create(RegisterViewModel userViewModel, params string[] selectedRoles)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = userViewModel.Email, Email = userViewModel.Email };
                var adminresult = await UserManager.CreateAsync(user, userViewModel.Password);

                //Add User to the selected Roles 
                if (adminresult.Succeeded)
                {
                    if (selectedRoles != null)
                    {
                        var result = await UserManager.AddToRolesAsync(user.Id, selectedRoles);
                        if (!result.Succeeded)
                        {
                            ModelState.AddModelError("", result.Errors.First());
                            ViewBag.RoleId = new SelectList(await RoleManager.Roles.ToListAsync(), "Name", "Name");
                            return View();
                        }
                    }
                }
                else
                {
                    ModelState.AddModelError("", adminresult.Errors.First());
                    ViewBag.RoleId = new SelectList(RoleManager.Roles, "Name", "Name");
                    return View();

                }
                return RedirectToAction("Index");
            }
            ViewBag.RoleId = new SelectList(RoleManager.Roles, "Name", "Name");
            return View();
        }

        //
        // GET: /Users/Edit/1
        public async Task<ActionResult> Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = await UserManager.FindByIdAsync(id);
            if (user == null)
            {
                return HttpNotFound();
            }

            var userRoles = await UserManager.GetRolesAsync(user.Id);
            string[] _userServers = user.Servers.Select(s => s.ServerShortName).ToArray();

            EditUserViewModel _view = new EditUserViewModel()
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName,
                UserNicName = user.UserNicName,
                PhoneNumber = user.PhoneNumber,

                RolesList = RoleManager.Roles.ToList().Select(x => new SelectListItem()
                {
                    Selected = userRoles.Contains(x.Name),
                    Text = x.Name,
                    Value = x.Name
                }),
                ServersList = ServerManager.Servers.
                    Where(s => s.CompanyId == user.CompanyId).
                    Select(s => new SelectListItem()
                    {
                        Selected = _userServers.Contains(s.ServerShortName),
                        Text = s.ServerShortName,
                        Value = s.ServerShortName
                    }).ToList()
            };
            foreach (ApplicationServer _s in user.Servers.Where(s => s.CompanyId != user.CompanyId))
                _view.ServersList.Add(new SelectListItem()
                {
                    Selected = true,
                    Text = _s.ServerShortName,
                    Value = _s.ServerShortName
                });
            return View(_view);
        }

        //
        // POST: /Users/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit(
            [Bind(Include = "Id,UserName,Email,FullName,FirstName,LastName,UserNicName,PhoneNumber,RolesList,ServersList")] EditUserViewModel editUser,
            params string[] selectedRole)
        {
            if (ModelState.IsValid)
            {
                bool _confirmEmail = false;
                var user = await UserManager.FindByIdAsync(editUser.Id);
                if (user == null)
                {
                    return HttpNotFound();
                }
                //
                if( user.UserName != editUser.UserName )
                    user.UserName = editUser.UserName;
                if( user.Email != editUser.Email )
                {
                    user.Email = editUser.Email;
                    user.EmailConfirmed = false;
                    _confirmEmail = true;
                }
                if ( user.FirstName != editUser.FirstName )
                    user.FirstName = editUser.FirstName;
                if( user.LastName != editUser.LastName )
                    user.LastName = editUser.LastName;
                if( user.FullName != editUser.FullName )
                    user.FullName = editUser.FullName;
                if( user.UserNicName != editUser.UserNicName )
                    user.UserNicName = editUser.UserNicName;
                if( user.PhoneNumber != editUser.PhoneNumber )
                {
                    user.PhoneNumber = editUser.PhoneNumber;
                    user.PhoneNumberConfirmed = false;
                }
                //
                // Add and delete roles
                //
                var userRoles = await UserManager.GetRolesAsync(user.Id);
                selectedRole = selectedRole ?? new string[] { };
                var result = await UserManager.AddToRolesAsync(user.Id, selectedRole.Except(userRoles).ToArray<string>());
                if (!result.Succeeded)
                {
                    ModelState.AddModelError("", result.Errors.First());
                    return View();
                }
                // remove roles
                result = await UserManager.RemoveFromRolesAsync(user.Id, userRoles.Except(selectedRole).ToArray<string>());
                if (!result.Succeeded)
                {
                    ModelState.AddModelError("", result.Errors.First());
                    return View();
                }
                //
                // Add and delete servers
                //
                List<string> _existingServers = user.Servers.Select( _s => _s.ServerShortName ).ToList();
                foreach ( SelectListItem _item in editUser.ServersList )
                {
                    bool _found = _existingServers.Contains( _item.Value );
                    if ( !_found && _item.Selected )
                        await ServerManager.AddToServerAsync( user, _item.Value );
                    if ( _found && !_item.Selected )
                        await ServerManager.RemoveFromServerAsync( user, _item.Value );
                    if ( !result.Succeeded )
                    {
                        ModelState.AddModelError( "", result.Errors.First() );
                        return View();
                    }
                }
                //
                // Send out the confirmation e-mail message
                //
                if ( _confirmEmail )
                {
                    UserManager.UserTokenProvider =
                        ProtectionTokenProvider.DataProtectionProvider("EmailConfirmation");
                    string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    var callbackUrl = Url.Action("ConfirmEmail", "Public",
                       new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    await UserManager.SendEmailAsync(user.Id,
                       "Confirm your e-mail address", 
                       "Please confirm your account's  e-mail address by clicking <a href=\""
                       + callbackUrl + "\">here</a>");
                    ViewBag.Message = "Check your email and confirm your account, " + 
                        "you must be confirmed before you can log in.";
                    Warning("Confirm your e-mail address sent. User must responed before user can login again.");
                }
                return RedirectToAction("Index");
            }
            ModelState.AddModelError("", "Something failed.");
            return View();
        }
        //
        // GET: /Users/Delete/5
        public async Task<ActionResult> Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = await UserManager.FindByIdAsync(id);
            if (user == null)
            {
                return HttpNotFound();
            }

            ViewBag.RoleNames = await UserManager.GetRolesAsync(user.Id);
            ViewBag.ServerNames = user.Servers.Select(s => s.ServerShortName).ToArray();

            return View(user);
        }

        //
        // POST: /Users/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(string id)
        {
            if (ModelState.IsValid)
            {
                if (id == null)
                {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
                }

                var user = await UserManager.FindByIdAsync(id);
                if (user == null)
                {
                    return HttpNotFound();
                }
                //
                // Remove side tables
                // Handle servers
                List<ApplicationServer> _servers = user.Servers.ToList();
                foreach (ApplicationServer _server in _servers)
                    user.Servers.Remove(_server);
                // Handle roles
                List<ApplicationUserRole> _roles = user.Roles.ToList();
                foreach (ApplicationUserRole _role in _roles)
                    user.Roles.Remove(_role);
                //
                var result = await UserManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    ModelState.AddModelError("", result.Errors.First());
                    return View();
                }
                return RedirectToAction("Index");
            }
            return View();
        }
    }
}
