using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
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
    public class Effort_IncidentNote_Tests
    {
        //
        private static ApplicationDbContext _niEntities = null;
        private static IncidentNoteAccess _sut = null;
        private static string _entityConnStr = "";
        private static string _fullPath = "";
        private long _incidentNoteId = 2;
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
        [DeploymentItem("NetIncedentUnitTest\\App_Data", "App_Data")]
        public void IncidentNoteTestInitialize()
        {
            //
            _niEntities = WebSrv_Tests.Effort_Helper.GetEffortEntity(_entityConnStr, _fullPath);
            _sut = new IncidentNoteAccess( _niEntities );
            //
        }
        //
        // Use TestCleanup to run code after each test has run
        [TestCleanup()]
        public void MyTestCleanup()
        {
            _niEntities.Dispose();
        }
        //
        #endregion
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_IncidentNote_ListByIncident_Test()
        {
            long _id = _incidentNoteId;
            List<IncidentNoteData> _data = _sut.ListByIncident(_id);
            Assert.IsTrue(_data.Count > 0);
            foreach (var _row in _data)
                System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_IncidentNote_GetByPrimaryKey_Test()
        {
            long _id = _incidentNoteId;
            IncidentNoteData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
            Assert.AreEqual(_row.IncidentNoteId, _id);
            System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_IncidentNote_Insert_Test()
        {
            DateTime _ndt = new DateTime(2016, 4, 21, 12, 12, 12);
            var _data = new IncidentNoteData()
            {
                IncidentNoteId = 0,
                NoteTypeId = 1,
                NoteTypeShortDesc = "Ping",
                Note = "Ping",
                CreatedDate = _ndt
            };
            IncidentNote _row = _sut.Insert(_data);
            Assert.IsNotNull(_row);
            _niEntities.SaveChanges();
            System.Diagnostics.Debug.WriteLine(_row.IncidentNoteId.ToString());
            Assert.IsTrue(_row.IncidentNoteId > 2);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_IncidentNote_InsertSave_Test()
        {
            int _before = _niEntities.IncidentNotes.Count();
            DateTime _ndt = new DateTime(2016, 4, 21, 12, 12, 12);
            var _data = new IncidentNoteData()
            {
                IncidentNoteId = 0,
                NoteTypeId = 1,
                NoteTypeShortDesc = "Ping",
                Note = "Ping",
                CreatedDate = _ndt
            };
            int _rowCnt = _sut.InsertSave(_data);
            Assert.AreEqual(_rowCnt, 1);
            int _after = _niEntities.IncidentNotes.Count();
            Assert.AreEqual(_before + 1 , _after);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_IncidentNote_Update_Test()
        {
            long _id = _incidentNoteId;
            string _newValue = "123456789 123456789";
            IncidentNoteData _row = _sut.GetByPrimaryKey(_id);
            _row.Note = _newValue;
            int _rowCnt = _sut.UpdateSave(_row);
            Assert.AreEqual(_rowCnt, 1);
            IncidentNoteData _new = _sut.GetByPrimaryKey(_id);
            System.Diagnostics.Debug.WriteLine(_new.ToString());
            Assert.AreEqual(_row.NoteTypeId, _new.NoteTypeId);
            Assert.AreEqual(_row.Note, _new.Note);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_IncidentNote_Delete_Test()
        {
            long _id = _incidentNoteId;
            int _actualCnt = _sut.DeleteSave(_id);
            Assert.AreEqual(1, _actualCnt);
            IncidentNoteData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNull(_row);
        }
        //
    }
}
