using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Data.Entity;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Threading.Tasks;
//
using NSG.Identity;
using NSG.Identity.Models;
using NSG.Identity.Incidents;
//
namespace WebSrv_Tests
{
    [TestClass]
    public class ApplicationUserManager_Tests
    {
        //
        private static ApplicationDbContext _context = null;
        private static ApplicationUserStore _userStore = null;
        private static ApplicationUserManager _sut = null;
        private static ApplicationServerManager _serverManager = null;
        //
        static string _userName = "PNH";
        //
        // Use TestInitialize to run code before running each test 
        [TestInitialize()]
        public void MyTestInitialize()
        {
            _context = ApplicationDbContext.Create();
            _userStore = new ApplicationUserStore(_context);
            _sut = new ApplicationUserManager(_userStore);
            _serverManager = new ApplicationServerManager(new ServerStore(_context));
        }
        //
        [ClassCleanup]
        public static void ApplicationUserManager_Cleanup()
        {
            ApplicationUser _user = _sut.FindByName(_userName);
            var _access = new WebSrv.Models.UserAccess(_context);
            _access.Delete(_user.Id);
        }
        //
        [TestMethod]
        public void ApplicationUserManager_AddUser_Test1()
        {
            //
            int _companyId = 1;
            Company _company = _context.Companies.FirstOrDefault();
            _companyId = _company.CompanyId;
            ApplicationUser _user = null;
            //
            _user = new ApplicationUser()
            {
                UserName = _userName,
                CompanyId = _companyId,
                Email = _userName + "@gmail.com",
                EmailConfirmed = true,
                FirstName = "PN",
                LastName = "Huhn",
                UserNicName = _userName,
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                LockoutEnabled = false,
                AccessFailedCount = 0,
                CreateDate = DateTime.Now,
            };
            _user.Servers = new List<ApplicationServer>();
            _user.FullName = string.Format("{0} {1}", _user.FirstName, _user.LastName);
            _sut.Create(_user,"p@ssW0rd");
            ApplicationUser _createdUser = _sut.FindByName(_userName);
            Assert.IsNotNull(_createdUser);
            ApplicationUserManager_AddUserRoles_Test1();
            ApplicationServerManager_AddUserServer_Test1();
        }
        //
        // [TestMethod]
        public void ApplicationUserManager_AddUserRoles_Test1()
        {
            //
            ApplicationUser _user = _sut.FindByName(_userName);
            _sut.AddToRoles(_user.Id, new string[] { "User", "Admin" });
            Assert.AreEqual(_user.Roles.Count(), 2);
        }
        //
        // [TestMethod]
        public void ApplicationServerManager_AddUserServer_Test1()
        {
            //
            string _serverShortName = "NSG Memb";
            ApplicationServer _srv = _serverManager.FindByName(_serverShortName);
            if (_srv == null)
            {
                Assert.Fail("Server: " + _serverShortName + " not found." );
            }
            ApplicationUser _user = _sut.FindByName(_userName);
            _serverManager.AddToServer(_user, _serverShortName);
            Assert.AreEqual(_user.Servers.Count(), 1);
        }
        //
    }
}
