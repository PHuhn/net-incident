using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Data.Entity.Core.Objects;
using System.Data.Common;
using System.Linq;
using Effort;
//
using NSG.Identity;
using NSG.Identity.Incidents;
using WebSrv.Models;
//
namespace WebSrv_Tests
{
    [TestClass]
    public class Effort_NetworkLog_Tests
    {
        //
        private static ApplicationDbContext _niEntities = null;
        private static NetworkLogAccess _sut = null;
        private static string _entityConnStr = "";
        private static string _fullPath = "";
        private long _incidentLogId = 2;
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
            _niEntities = WebSrv_Tests.Effort_Helper.GetEffortEntity(_entityConnStr, _fullPath);
            _sut = new NetworkLogAccess( _niEntities );
            //
        }
        //
        // Use TestCleanup to run code after each test has run
        [TestCleanup()]
        public void NetworkLogTestCleanup()
        {
            _niEntities.Dispose();
        }
        //
        #endregion
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("NetworkLog")]
        public void Effort_NetworkLog_ListByIncident_Test()
        {
            List<NetworkLogData> _data = _sut.ListByIncident(1, 1, false);
            Assert.IsTrue(_data.Count > 0);
            foreach (var _row in _data)
                System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("NetworkLog")]
        public void Effort_NetworkLog_GetByPrimaryKey_Test()
        {
            long _id = _incidentLogId;
            NetworkLogData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
            Assert.AreEqual(_row.NetworkLogId, _id);
            System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("NetworkLog")]
        public void Effort_NetworkLog_Insert_Test()
        {
            int _before = _niEntities.NetworkLogs.Count();
            DateTime _idt = new DateTime(2016, 4, 21, 12, 12, 12);
            NetworkLogData _row = new NetworkLogData() { ServerId = 1,
                IncidentId = 3, IPAddress = "127.0.0.1", NetworkLogDate = _idt,
                Log = "Logs", IncidentTypeId = 1,
                IncidentTypeShortDesc = "SQL", Selected = true, IsChanged = true
            };
            int _actualCnt = _sut.InsertSave( _row );
            Assert.AreEqual(1, _actualCnt);
            int _after = _niEntities.NetworkLogs.Count();
            Assert.AreEqual(_before + 1, _after);
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("NetworkLog")]
        public void Effort_NetworkLog_Update_Test()
        {
            // only IncidentId
            long _id = _incidentLogId;
            int _incidentId = 3;
            NetworkLogData _row = _sut.GetByPrimaryKey(_id);
            _row.IncidentId = _incidentId;
            int _rowCnt = _sut.UpdateIncidentIdSave(_row);
            Assert.AreEqual(_rowCnt, 1);
            NetworkLogData _new = _sut.GetByPrimaryKey(_id);
            Console.WriteLine(_new.ToString());
            Assert.AreEqual(_row.IncidentId, _new.IncidentId);
            Assert.AreEqual(_row.IPAddress, _new.IPAddress);
            Assert.AreEqual(_row.NetworkLogDate, _new.NetworkLogDate);
            Assert.AreEqual(_row.Log, _new.Log);
            Assert.AreEqual(_row.IncidentTypeId, _new.IncidentTypeId);
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("NetworkLog")]
        public void Effort_NetworkLog_Delete_Test()
        {
            long _id = _incidentLogId;
            int _actualCnt = _sut.DeleteSave(_id);
            Assert.AreEqual(1, _actualCnt);
            NetworkLogData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNull(_row);
        }
        //
    }
}
