using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Effort;
//
using NSG.Identity;
using NSG.Identity.Incidents;
using WebSrv.Models;
using System.Data.Entity.Validation;
//
namespace WebSrv_Tests
{
    [TestClass]
    public class Effort_ServerStore_Tests
    {
        //
        private static ApplicationDbContext _dbContext = null;
        private static string _entityConnStr = "";
        private static string _fullPath = "";
        //
        private static ServerStore _sut = null;
        private static string testServerName = "Test Srv";
        private static string existServerName = "NSG Memb";
        private static ApplicationServer testServer;
        //
        private TestContext testContextInstance;
        //
        #region "Effort Initialization"
        //
        ///<summary>
        /// Gets or sets the test context which provides
        /// information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get { return testContextInstance; }
            set { testContextInstance = value; }
        }
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
            _sut = new ServerStore(_dbContext);
            int _companyId = 1;
            Company _company1 = _dbContext.Companies.FirstOrDefault(c => c.CompanyId == _companyId);
            testServer = new ApplicationServer()
            {
                CompanyId = _companyId,
                Company = _company1,
                ServerShortName = testServerName,
                ServerName = testServerName,
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
            //
        }
        //
        // Use TestCleanup to run code after each test has run
        [TestCleanup()]
        public void NetworkLogTestCleanup()
        {
            _dbContext.Dispose();
        }
        //
        #endregion
        //
        //  Find-By Tests:
        //      Task<ApplicationServer> FindByIdAsync(int ServerId)
        //      ApplicationServer FindById(int ServerId)
        //      Task<ApplicationServer> FindByNameAsync(string shortName)
        //      ApplicationServer FindByName(string shortName)
        //
        #region "Find-By Tests"
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_FindByIdAsync_Test()
        {
            // Task<ApplicationServer> FindByIdAsync(int ServerId)
            int _serverId = 1;
            Task.Run(async () =>
            {
                ApplicationServer _actual = await _sut.FindByIdAsync(_serverId);
                Assert.AreEqual(_serverId, _actual.ServerId);
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_FindById_Test()
        {
            // ApplicationServer FindById(int ServerId)
            int _serverId = 1;
            ApplicationServer _actual = _sut.FindById(_serverId);
            Assert.AreEqual(_serverId, _actual.ServerId);
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_FindByNameAsync_Test()
        {
            // Task<ApplicationServer> FindByNameAsync(string ServerName)
            string _server = existServerName;
            Task.Run(async () =>
            {
                ApplicationServer _actual = await _sut.FindByNameAsync(_server);
                Assert.AreEqual(_server, _actual.ServerShortName);
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_FindByName_Test()
        {
            // ApplicationServer FindByName(string ServerName)
            string _server = existServerName;
            ApplicationServer _actual = _sut.FindByName(_server);
            Assert.AreEqual(_server, _actual.ServerShortName);
        }
        //
        #endregion // Find-By Tests
        //
        //  Server CRUD Tests:
        //      Task CreateAsync(ApplicationServer server)
        //      Task UpdateAsync(ApplicationServer server)
        //      Task DeleteAsync(ApplicationServer server)
        //
        #region "Server CRUD Tests"
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_CreateAsync_Test()
        {
            // Task CreateAsync(ApplicationServer server)
            int _expectedCount = _dbContext.Servers.Count() + 1;
            Task.Run(async () =>
            {
                await _sut.CreateAsync( testServer );
                Assert.AreEqual(_expectedCount, _dbContext.Servers.Count());
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_UpdateAsync_Test()
        {
            // Task UpdateAsync(ApplicationServer server)
            string _serverName = "xxxxxxxxxxxxxxxxxxxxxxxxx";
            ApplicationServer _server = _sut.FindByName(existServerName);
            _server.ServerName = _serverName;
            Task.Run(async () =>
            {
                await _sut.UpdateAsync(_server);
                ApplicationServer _serverUpdated = _sut.FindByName(existServerName);
                Assert.AreEqual(_serverName, _serverUpdated.ServerName);
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_DeleteAsync_Test()
        {
            // Task DeleteAsync(ApplicationServer server)
            _sut.Create(testServer);
            ApplicationServer _server = _sut.FindByName(testServerName);
            int _expectedCount = _dbContext.Servers.Count() - 1;
            Task.Run(async () =>
            {
                await _sut.DeleteAsync(_server);
                Assert.AreEqual(_expectedCount, _dbContext.Servers.Count());
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_DeleteAsync_Fail_Test()
        {
            // Task DeleteAsync(ApplicationServer server)
            ApplicationServer _server = _sut.FindByName(existServerName);
            int _expectedCount = _dbContext.Servers.Count() - 1;
            Task.Run(async () =>
            {
                try
                {
                    // Foreign key violation [dbo_IncidentIncidentNotes :: Incident_IncidentId]. The key value [1] does not exists in the referenced table [dbo_Incident :: IncidentId].. Error code: RelationError
                    await _sut.DeleteAsync(_server);
                    Assert.Fail();
                }
                catch (DbEntityValidationException _entityEx)
                {
                    // extension method
                    string _errors = _entityEx.EntityValidationErrors.GetDbValidationErrors();
                    Console.WriteLine(_errors);
                    Assert.Fail();
                }
                catch (Exception _ex)
                {
                    _ex = _ex.GetBaseException();
                    Console.WriteLine(_ex.Message);
                }
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_DeleteAsync_Bad_Test()
        {
            // Task DeleteAsync(ApplicationServer server)
            int _expectedCount = _dbContext.Servers.Count();
            Task.Run(async () =>
            {
                await _sut.DeleteAsync(testServer);
                Assert.AreEqual(_expectedCount, _dbContext.Servers.Count());
            }).GetAwaiter().GetResult();
        }
        //
        #endregion // Server CRUD
        //
        //  User-Server Tests:
        //      Task AddToServerAsync(ApplicationUser user, string serverName)
        //      Task<IList<string>> GetServersAsync(ApplicationUser user)
        //      Task<bool> IsInServerAsync(ApplicationUser user, string server)
        //      Task RemoveFromServerAsync(ApplicationUser user, string server)
        //
        #region "User-Server Tests"
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_AddToServerAsync_Test()
        {
            // Task AddToServerAsync(ApplicationUser user, string serverName)
            // Add a new test server
            _dbContext.Servers.Add(testServer);
            _dbContext.SaveChanges();
            // Get user
            ApplicationUser _user = _dbContext.Users.FirstOrDefault( u => u.UserName == "Phil" );
            int _expectedCount = _user.Servers.Count + 1;
            // end of setup
            Task.Run(async () =>
            {
                await _sut.AddToServerAsync( _user, testServerName );
                Assert.AreEqual(_expectedCount, _user.Servers.Count);
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_AddToServerAsync_Bad1_Test()
        {
            // Task AddToServerAsync(ApplicationUser user, string serverName)
            // Get user
            ApplicationUser _user = _dbContext.Users.FirstOrDefault(u => u.UserName == "Phil");
            int _expectedCount = _user.Servers.Count;
            // end of setup
            Task.Run(async () =>
            {
                await _sut.AddToServerAsync(_user, testServerName);
                Assert.AreEqual(_expectedCount, _user.Servers.Count);
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_AddToServerAsync_Bad2_Test()
        {
            // Task AddToServerAsync(ApplicationUser user, string serverName)
            // Get user
            ApplicationUser _user = _dbContext.Users.FirstOrDefault(u => u.UserName == "Phil");
            int _expectedCount = _user.Servers.Count;
            // end of setup
            Task.Run(async () =>
            {
                await _sut.AddToServerAsync( _user, existServerName );
                Assert.AreEqual(_expectedCount, _user.Servers.Count);
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_GetServersAsync_Test()
        {
            // Task<IList<string>> GetServersAsync(ApplicationUser user)
            // Get user
            ApplicationUser _user = _dbContext.Users.FirstOrDefault(u => u.UserName == "Phil");
            int _expectedCount = _user.Servers.Count;
            // end of setup
            Task.Run(async () =>
            {
                List<string> _actual = await _sut.GetServersAsync( _user );
                Assert.AreEqual(_expectedCount, _actual.Count);
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_IsInServerAsync_Found_Test()
        {
            // Task<bool> IsInServerAsync(ApplicationUser user, string server)
            // Get user
            ApplicationUser _user = _dbContext.Users.FirstOrDefault(u => u.UserName == "Phil");
            bool _expected = true;
            // end of setup
            Task.Run(async () =>
            {
                bool _actual = await _sut.IsInServerAsync( _user, existServerName );
                Assert.AreEqual( _expected, _actual );
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_IsInServerAsync_NotFound_Test()
        {
            // Task<bool> IsInServerAsync(ApplicationUser user, string server)
            // Get user
            ApplicationUser _user = _dbContext.Users.FirstOrDefault(u => u.UserName == "Phil");
            bool _expected = false;
            // end of setup
            Task.Run(async () =>
            {
                bool _actual = await _sut.IsInServerAsync(_user, testServerName);
                Assert.AreEqual(_expected, _actual);
            }).GetAwaiter().GetResult();
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("ServerStore")]
        public void Effort_ServerStore_RemoveFromServerAsync_Test()
        {
            // Task RemoveFromServerAsync(ApplicationUser user, string server)
            // Get user
            ApplicationUser _user = _dbContext.Users.FirstOrDefault(u => u.UserName == "Phil");
            int _expectedCount = _user.Servers.Count - 1;
            // end of setup
            Task.Run(async () =>
            {
                await _sut.RemoveFromServerAsync(_user, existServerName);
                Assert.AreEqual(_expectedCount, _user.Servers.Count);
            }).GetAwaiter().GetResult();
        }
        //
        #endregion // User-Server
        //
    }
}
//
