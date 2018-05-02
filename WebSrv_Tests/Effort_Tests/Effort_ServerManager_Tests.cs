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
    public class Effort_ServerManager_Tests
    {
        //
        private static ApplicationDbContext _dbContext = null;
        private static string _entityConnStr = "";
        private static string _fullPath = "";
        //
        ApplicationServerManager _sut = null;
        //
        //
        // Use ClassInitialize to run code before running the first test in the class
        [ClassInitialize()]
        public static void MyClassInitialize(TestContext testContext)
        {
            _fullPath = WebSrv_Tests.Effort_Helper.CSV_FullPath;
            _entityConnStr = WebSrv_Tests.Effort_Helper.GetConnectionString();
        }
        //
        // Use TestInitialize to run code before running each test
        [TestInitialize()]
        [DeploymentItem("NetIncedentUnitTest\\App_Data\\Effort", "App_Data\\Effort")]
        public void NetworkLogTestInitialize()
        {
            //
            _dbContext = WebSrv_Tests.Effort_Helper.GetEffortEntity(_entityConnStr, _fullPath);
            _sut = new ApplicationServerManager(new ServerStore(_dbContext));
        }
        //
        //
        [TestMethod]
        public void ApplicationServerManager_FindByName_Test()
        {
            string _serverShortName = "nsg memb";
            ApplicationServer _actual = _sut.FindByName(_serverShortName);
            Assert.AreEqual(_serverShortName, _actual.ServerShortName.ToLower());
        }
        //
        [TestMethod]
        public void ApplicationServerManager_ServerCreate_Test()
        {
            //
            Company _company = _dbContext.Companies.FirstOrDefault();
            int _companyId = _company.CompanyId;
            string _serverShortName = "Test Srv";
            string _serverNewName = "Tests";
            var _server = new ApplicationServer()
            {
                CompanyId = _companyId,
                ServerShortName = _serverShortName,
                ServerName = _serverShortName,
                ServerDescription = "Public facing members Web-site",
                WebSite = "Web-site address: www.any.com",
                ServerLocation = "We are in Michigan, USA.",
                FromName = "Phil Huhn",
                FromNicName = "Phil",
                FromEmailAddress = "PhilHuhn@yahoo.com",
                TimeZone = "EST (UTC-5)",
                DST = true,
                TimeZone_DST = "EDT (UTC-4)",
                DST_Start = new DateTime(2018, 3, 11, 2, 0, 0),
                DST_End = new DateTime(2018, 11, 4, 2, 0, 0)
            };
            _sut.Create(_server);
            var _serverName = _sut.FindByName(_serverShortName);
            Assert.AreEqual(_serverName.ServerShortName, _serverShortName);
            var _serverById = _sut.FindById(_serverName.ServerId);
            Assert.AreEqual(_serverById.ServerShortName, _serverShortName);
            _serverById.ServerName = _serverNewName;
            _sut.Update(_serverById);
            _serverById = _sut.FindById(_serverName.ServerId);
            Assert.AreEqual(_serverById.ServerName, _serverNewName);
            _sut.Delete(_serverById);
            _serverById = _sut.FindById(_serverName.ServerId);
            Assert.IsNull(_serverById);
        }
        //
    }
}
