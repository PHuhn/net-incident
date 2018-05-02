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
    public class Effort_NoteTypes_Tests
    {
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
            _sut = new NoteTypeAccess( _niEntities );
            //
        }
        //
        // Use TestCleanup to run code after each test has run
        [TestCleanup()]
        public void NoteTypeTestCleanup()
        {
            _niEntities.Dispose();
        }
        //
        #endregion
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NoteTypes_ListByIncident_Test()
        {
            int _id = _noteTypeId;
            List<NoteTypeData> _data = _sut.List( );
            Assert.IsTrue(_data.Count > 0);
            foreach (var _row in _data)
                System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NoteTypes_GetByPrimaryKey_Test()
        {
            int _id = _noteTypeId;
            NoteTypeData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
            Assert.AreEqual(_row.NoteTypeId, _id);
            System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NoteTypes_Insert_Test()
        {
            int _id = 0;
            int _actualCnt = _sut.Insert(ref _id, "test 1", "test 1");
            Assert.AreEqual(1, _actualCnt);
            Assert.IsTrue(_id > 2);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NoteTypes_Update_Test()
        {
            int _id = _noteTypeId;
            NoteTypeData _row = _sut.GetByPrimaryKey(_id);
            _row.NoteTypeDesc = "123456789 123456789";
            int _rowCnt = _sut.Update(_row.NoteTypeId, _row.NoteTypeDesc, _row.NoteTypeShortDesc);
            Assert.AreEqual(_rowCnt, 1);
            NoteTypeData _new = _sut.GetByPrimaryKey(_id);
            System.Diagnostics.Debug.WriteLine(_new.ToString());
            Assert.AreEqual(_row.NoteTypeId, _new.NoteTypeId);
            Assert.AreEqual(_row.NoteTypeDesc, _new.NoteTypeDesc);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NoteTypes_Delete_Test()
        {
            int _id = _noteTypeId;
            int _actualCnt = _sut.Delete(_id);
            Assert.AreEqual(1, _actualCnt);
            NoteTypeData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNull(_row);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NoteTypes_DeleteFail_Test()
        {
            int _id = 1;
            int _actualCnt = _sut.Delete(_id);
            Assert.AreEqual(0, _actualCnt);
            NoteTypeData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NoteType_Verify_Delete_Test()
        {
            NoteType _nt = new NoteType() { NoteTypeShortDesc = "t1", NoteTypeDesc = "t1" };
            _niEntities.NoteTypes.Add(_nt);
            _niEntities.SaveChanges();
            int _id = _nt.NoteTypeId;
            NoteType _newNT = _niEntities.NoteTypes.FirstOrDefault(_t => _t.NoteTypeId == _id);
            Assert.IsNotNull(_newNT);
            _niEntities.NoteTypes.Remove(_newNT);
            _niEntities.SaveChanges();
            _newNT = _niEntities.NoteTypes.FirstOrDefault(_t => _t.NoteTypeId == _id);
            Assert.IsNull(_newNT);
        }
        //
        // [TestMethod(), TestCategory("Effort")]
        public void Effort_NoteType_Verify_CascadingDelete_Test()
        {
            IncidentNote _iNote = _niEntities.IncidentNotes.FirstOrDefault(_in => _in.IncidentNoteId == 2);
            NoteType _newNT = _niEntities.NoteTypes.FirstOrDefault(_t => _t.NoteTypeId == _iNote.NoteTypeId);
            _niEntities.NoteTypes.Remove(_newNT);
            _niEntities.SaveChanges();
            _iNote = _niEntities.IncidentNotes.FirstOrDefault(_in => _in.IncidentNoteId == 2);
            // cascading deletes
            Assert.IsNull(_iNote);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NoteType_Verify_NonCascadingDelete_Test()
        {
            IncidentNote _iNote = _niEntities.IncidentNotes.FirstOrDefault(_in => _in.IncidentNoteId == 2);
            NoteType _newNT = _niEntities.NoteTypes.FirstOrDefault(_t => _t.NoteTypeId == _iNote.NoteTypeId);
            _niEntities.NoteTypes.Remove(_newNT);
            try
            {
                _niEntities.SaveChanges();
                Assert.Fail("Save Changes did not fail, because deleting on...");
            }
            catch (Exception _ex)
            {
                Console.WriteLine(_ex.Message);
                if (_ex.InnerException != null)
                    Console.WriteLine(_ex.InnerException.ToString());
            }
        }
        //
    }
}
