//
using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Effort;
//
using NSG.Identity;
using NSG.Identity.Incidents;
using WebSrv.Models;
//
namespace WebSrv_Tests.Effort_Tests
{
    /// <summary>
    /// Summary description for Effort_Users_Tests
    /// </summary>
    [TestClass]
    public class Effort_Users_Tests
    {
        public Effort_Users_Tests()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        //
        private static ApplicationDbContext _niEntities = null;
        private static NoteTypeAccess _sut = null;
        private static string _entityConnStr = "";
        private static string _fullPath = "";
        private int _noteTypeId = 5;
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
        public static void NoteTypeClassInitialize(TestContext testContext)
        {
            _fullPath = WebSrv_Tests.Effort_Helper.CSV_FullPath;
            _entityConnStr = WebSrv_Tests.Effort_Helper.GetConnectionString();
        }
        //
        // Use TestInitialize to run code before running each test
        [TestInitialize()]
        [DeploymentItem("NetIncedentUnitTest\\App_Data", "App_Data")]
        public void NoteTypeTestInitialize()
        {
            //
            _niEntities = WebSrv_Tests.Effort_Helper.GetEffortEntity(_entityConnStr, _fullPath);
            _sut = new NoteTypeAccess(_niEntities);
            //
        }
        //
        // Use TestCleanup to run code after each test has run
        [TestCleanup()]
        public void UsersTestCleanup()
        {
            _niEntities.Dispose();
        }
        //
        #endregion
        //
        [TestMethod]
        public void User_GetByUserName_Test()
        {
            Console.WriteLine( _fullPath );
            string userName = "Phil";
            UserAccess _access = new UserAccess( _niEntities );
            UserServerData _actual = _access.GetByUserName( userName );
            //
            Assert.AreEqual( userName, _actual.UserName );
        }
        //
        [TestMethod]
        public void User_GetUserServerByUserName_Test()
        {
            Console.WriteLine( _fullPath );
            string _userName = "Phil";
            string _serverShortName = "nsg memb";
            UserAccess _access = new UserAccess( _niEntities );
            UserServerData _actual = _access.GetUserServerByUserName( _userName, _serverShortName );
            //
            Assert.AreEqual( _userName, _actual.UserName );
        }
    }
}
