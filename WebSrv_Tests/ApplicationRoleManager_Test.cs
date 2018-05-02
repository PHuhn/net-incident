using System;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
//
using NSG.Identity;
using NSG.Identity.Models;
using NSG.Identity.Incidents;
//
namespace WebSrv_Tests
{
    [TestClass]
    public class ApplicationRoleManager_Test
    {
        //
        private ApplicationDbContext _context = null;
        private ApplicationRoleStore _roleStore = null;
        private ApplicationRoleManager _sut = null;
        //
        // Use TestInitialize to run code before running each test 
        [TestInitialize()]
        public void MyTestInitialize()
        {
            _context = ApplicationDbContext.Create();
            _roleStore = new ApplicationRoleStore(_context);
            _sut = new ApplicationRoleManager(_roleStore);
        }
        //
        [TestMethod]
        public void ApplicationRoleManager_Roles_List_Test()
        {
            var _roles = _sut.Roles.ToList();
            Console.WriteLine(_roles.Count);
            Assert.IsTrue(_roles.Count > 1);
        }
        //
        [TestMethod]
        public void ApplicationRoleManager_FindById_Test()
        {
            string _id = "adm";
            var _role = _sut.FindById( _id );
            Console.WriteLine(_role.ToString());
            Assert.AreEqual(_id, _role.Id);
        }
        //
        [TestMethod]
        public void ApplicationRoleManager_FindByName_Test()
        {
            string _name = "Admin";
            var _role = _sut.FindByName(_name);
            Console.WriteLine(_role.ToString());
            Assert.AreEqual(_name, _role.Name);
        }
        //
        [TestMethod]
        public void ApplicationRoleManager_RoleExists_Test()
        {
            string _name = "Admin";
            var _actual = _sut.RoleExists(_name);
            Console.WriteLine(_actual.ToString());
            Assert.IsTrue(_actual);
        }
        //
        [TestMethod]
        public void ApplicationRoleManager_AddUpdateDelete_Test()
        {
            var _roleTst = new ApplicationRole() { Id = "tst", Name = "Test" };
            _sut.Create(_roleTst);
            var _role = _sut.FindByName(_roleTst.Name);
            Assert.AreEqual(_role.Id, _roleTst.Id);
            var _roleById = _sut.FindById(_roleTst.Id);
            Assert.AreEqual(_roleById.Name, _roleTst.Name);
            _roleTst.Name = "Tests";
            _sut.Update(_roleTst);
            _roleById = _sut.FindById(_roleTst.Id);
            Assert.AreEqual(_roleById.Name, _roleTst.Name);
            _sut.Delete(_roleTst);
            _roleById = _sut.FindById(_roleTst.Id);
            Assert.IsNull(_roleById);
            //Task.Run(async () =>
            //{
            //}).GetAwaiter().GetResult();
        }
        //
        // [TestMethod]
        public void ApplicationRoleManager_RoleManagerList_Test()
        {
            var _roleManager = new RoleManager<IdentityRole, string>(new RoleStore<IdentityRole>(_context));
            var _roles = _roleManager.Roles.ToList();
            Console.WriteLine(_roles.Count);
            Assert.IsTrue(_roles.Count > 1);
        }
    }
}
