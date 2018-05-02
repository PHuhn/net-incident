using System;
using System.Linq;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using Microsoft.VisualStudio.TestTools.UnitTesting;
//
using WebSrv.Models;
using NSG.Identity;
using NSG.Identity.Incidents;
//
namespace WebSrv_Tests
{
    [TestClass]
    public class WebSrv_NetIncident_Tests
    {
        //
        private static ApplicationDbContext _niEntities = null;
        //
        private TestContext testContextInstance;
        //
        #region "Test Initialization"
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
        public static void NetIncidentClassInitialize(TestContext testContext)
        {
        }
        //
        // Use TestInitialize to run code before running each test
        [TestInitialize()]
        public void NetIncidentTestInitialize()
        {
            //
            _niEntities = ApplicationDbContext.Create();
            //
        }
        //
        // Use TestCleanup to run code after each test has run
        [TestCleanup()]
        public void NetIncidentTestCleanup()
        {
            _niEntities.Dispose();
        }
        //
        #endregion
        //
        #region "Incident Access"
        //
        [TestMethod(), TestCategory("EF_Native")]
        public void WebSrv_NI_Incident_ListbyFlags_MailedClosed_Test()
        {
            IncidentAccess _sut = new IncidentAccess(_niEntities);
            List<IncidentData> _data = _sut.ListbyFlags(true, true, false);
            Assert.IsTrue(_data.Count > 0);
            Assert.AreEqual(_data[0].ServerId, 1);
            foreach (var _row in _data)
                System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("EF_Native")]
        public void WebSrv_NI_Incident_GetByPrimaryKey_Test()
        {
            long _id = 1;
            IncidentAccess _sut = new IncidentAccess(_niEntities);
            IncidentData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
            Assert.AreEqual(_row.IncidentId, _id);
            System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        #endregion
        //
        #region "IncidentNote Access"
        //
        [TestMethod(), TestCategory("EF_Native")]
        public void WebSrv_NI_IncidentNote_ListByIncident_Test()
        {
            long _id = 1;
            IncidentNoteAccess _sut = new IncidentNoteAccess(_niEntities);
            List<IncidentNoteData> _data = _sut.ListByIncident(_id);
            Assert.IsTrue(_data.Count > 0);
            foreach (var _row in _data)
                System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("EF_Native")]
        public void WebSrv_NI_IncidentNote_GetByPrimaryKey_Test()
        {
            long _id = 2;
            IncidentNoteAccess _sut = new IncidentNoteAccess(_niEntities);
            IncidentNoteData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
            Assert.AreEqual(_row.IncidentNoteId, _id);
            System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        #endregion
        //
        #region "NetworkLog Access"
        //
        [TestMethod(), TestCategory("EF_Native")]
        public void WebSrv_NI_NetworkLog_ListByIncident1_Test()
        {
            NetworkLogAccess _sut = new NetworkLogAccess(_niEntities);
            List<NetworkLogData> _data = _sut.ListByIncident(1, 1, true);
            Assert.IsTrue(_data.Count > 0);
            Assert.AreEqual(_data[0].ServerId, 1);
            foreach (var _row in _data)
                System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("EF_Native")]
        public void WebSrv_NI_NetworkLog_ListByIncident2_Test()
        {
            NetworkLogAccess _sut = new NetworkLogAccess(_niEntities);
            List<NetworkLogData> _data = _sut.ListByIncident(1, 2, false);
            Assert.IsTrue(_data.Count > 0);
            Assert.AreEqual(_data[0].ServerId, 1);
            foreach (var _row in _data)
                System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("EF_Native")]
        public void WebSrv_NI_NetworkLog_GetByPrimaryKey_Test()
        {
            long _id = 1;
            NetworkLogAccess _sut = new NetworkLogAccess(_niEntities);
            NetworkLogData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
            Assert.AreEqual(_row.NetworkLogId, _id);
            System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        #endregion
        //
        #region "NetworkIncident Access"
        //
        [TestMethod(), TestCategory("EF_Native")]
        public void WebSrv_NI_NetworkIncident_Get0_Test()
        {
            long _id = 0;
            NetworkIncidentAccess _sut = new NetworkIncidentAccess(_niEntities);
            NetworkIncidentData _data = _sut.GetByPrimaryKey(_id, 1);
            Assert.IsNotNull(_data);
            Assert.AreEqual(_data.incident.IncidentId, _id);
            System.Diagnostics.Debug.WriteLine(_data.incident.ToString());
            System.Diagnostics.Debug.WriteLine( "Notes" );
            foreach (IncidentNoteData _note in _data.incidentNotes)
                System.Diagnostics.Debug.WriteLine(_note.ToString());
            System.Diagnostics.Debug.WriteLine( "Logs" );
            foreach (NetworkLogData _log in _data.networkLogs)
                System.Diagnostics.Debug.WriteLine(_log.ToString());
            Assert.IsTrue(_data.networkLogs.Count > 0);
        }
        //
        [TestMethod(), TestCategory("EF_Native")]
        public void WebSrv_NI_NetworkIncident_Get1_Test()
        {
            long _id = 1;
            NetworkIncidentAccess _sut = new NetworkIncidentAccess(_niEntities);
            NetworkIncidentData _data = _sut.GetByPrimaryKey(_id, 1);
            Assert.IsNotNull(_data);
            Assert.AreEqual(_data.incident.IncidentId, _id);
            System.Diagnostics.Debug.WriteLine(_data.incident.ToString());
            foreach( IncidentNoteData _note in _data.incidentNotes )
                System.Diagnostics.Debug.WriteLine(_note.ToString());
            foreach (NetworkLogData _log in _data.networkLogs)
                System.Diagnostics.Debug.WriteLine(_log.ToString());
            foreach (NetworkLogData _ilog in _data.deletedLogs)
                System.Diagnostics.Debug.WriteLine(_ilog.ToString());
            foreach (SelectItem _nic in _data.NICs)
                System.Diagnostics.Debug.WriteLine(_nic.ToString());
            foreach (SelectItem _it in _data.incidentTypes)
                System.Diagnostics.Debug.WriteLine(_it.ToString());
            foreach (SelectItem _nt in _data.noteTypes)
                System.Diagnostics.Debug.WriteLine(_nt.ToString());
        }
        //
        [TestMethod(), TestCategory("EF_Native")]
        public void WebSrv_NI_NetworkIncident_Get2_Test()
        {
            long _id = 2;
            NetworkIncidentAccess _sut = new NetworkIncidentAccess(_niEntities);
            NetworkIncidentData _data = _sut.GetByPrimaryKey(_id, 1);
            Assert.IsNotNull(_data);
            Assert.AreEqual(_data.incident.IncidentId, _id);
            System.Diagnostics.Debug.WriteLine(_data.incident.ToString());
            foreach (IncidentNoteData _note in _data.incidentNotes)
                System.Diagnostics.Debug.WriteLine(_note.ToString());
            foreach (NetworkLogData _log in _data.networkLogs)
                System.Diagnostics.Debug.WriteLine(_log.ToString());
        }
        //
        #endregion
        //
    }
}
