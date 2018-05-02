using System;
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
        private ApplicationDbContext _context = null;
        private ApplicationUserStore _userStore = null;
        private ApplicationUserManager _sut = null;
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
            _user.FullName = string.Format("{0} {1}", _user.FirstName, _user.LastName);
            _sut.Create(_user,"p@ssW0rd");
            ApplicationUser _createdUser = _sut.FindByName(_userName);
            Assert.IsNotNull(_createdUser);
        }
        //
        [TestMethod]
        public void ApplicationUserManager_AddUserRoles_Test1()
        {
            //
            ApplicationUser _user = _sut.FindByName(_userName);
            _sut.AddToRoles(_user.Id, new string[] { "User", "Admin" });
            Assert.AreEqual(_user.Roles.Count(), 2);
        }
        //
        [TestMethod]
        public void ApplicationServerManager_AddUserServer_Test1()
        {
            //
            string _serverShortName = "NSG Memb";
            ApplicationDbContext context = ApplicationDbContext.Create();
            var _serverManager = new ApplicationServerManager(new ServerStore(context));
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
