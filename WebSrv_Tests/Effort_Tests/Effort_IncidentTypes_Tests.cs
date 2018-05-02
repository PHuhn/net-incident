using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Data.Entity.Validation;
using Effort;
//
using NSG.Identity;
using NSG.Identity.Incidents;
using WebSrv.Models;
//
namespace WebSrv_Tests
{
    [TestClass]
    public class Effort_IncidentTypes_Tests
    {
        //
        private static ApplicationDbContext _niEntities = null;
        private static IncidentTypeAccess _sut = null;
        private static string _entityConnStr = "";
        private static string _fullPath = "";
        private int _incidentTypeId = 5;
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
            _sut = new IncidentTypeAccess( _niEntities );
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
        public void Effort_IncidentTypes_ListByIncident_Test()
        {
            int _id = _incidentTypeId;
            List<IncidentTypeData> _data = _sut.List( );
            Assert.IsTrue(_data.Count > 0);
            foreach (var _row in _data)
                System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_IncidentTypes_GetByPrimaryKey_Test()
        {
            int _id = _incidentTypeId;
            IncidentTypeData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
            Assert.AreEqual(_row.IncidentTypeId, _id);
            System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_IncidentTypes_Insert_Test()
        {
            int _id = 0;
            // IncidentTypeId,IncidentTypeShortDesc,IncidentTypeDesc,IncidentTypeFromCompany,IncidentTypeSubjectLine,IncidentTypeEmailTemplate,IncidentTypeTimeTemplate,IncidentTypeThanksTemplate,IncidentTypeLogTemplate,IncidentTypeTemplate
            try
            {
                int _actualCnt = _sut.Insert(ref _id, "Test typ", "Test type description", true, "IncidentTypeSubjectLine", "IncidentTypeEmailTemplate", "IncidentTypeTimeTemplate", "IncidentTypeThanksTemplate", "IncidentTypeLogTemplate", "IncidentTypeTemplate");
                Assert.AreEqual(1, _actualCnt);
                Assert.IsTrue(_id > 2);
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
                Console.WriteLine(_ex.Message);
                Assert.Fail();
            }
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_IncidentTypes_Update_Test()
        {
            int _id = _incidentTypeId;
            IncidentTypeData _row = _sut.GetByPrimaryKey(_id);
            _row.IncidentTypeDesc = "123456789 123456789";
            int _rowCnt = _sut.Update(_row.IncidentTypeId, _row.IncidentTypeShortDesc, _row.IncidentTypeDesc, _row.IncidentTypeFromServer, _row.IncidentTypeSubjectLine, _row.IncidentTypeEmailTemplate, _row.IncidentTypeTimeTemplate, _row.IncidentTypeThanksTemplate, _row.IncidentTypeLogTemplate, _row.IncidentTypeTemplate);
            Assert.AreEqual(_rowCnt, 1);
            IncidentTypeData _new = _sut.GetByPrimaryKey(_id);
            System.Diagnostics.Debug.WriteLine(_new.ToString());
            Assert.AreEqual(_row.IncidentTypeId, _new.IncidentTypeId);
            Assert.AreEqual(_row.IncidentTypeDesc, _new.IncidentTypeDesc);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_IncidentTypes_Delete_Test()
        {
            int _id = _incidentTypeId;
            int _actualCnt = _sut.Delete(_id);
            Assert.AreEqual(1, _actualCnt);
            IncidentTypeData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNull(_row);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_IncidentTypes_DeleteFail_Test()
        {
            int _id = 2;
            int _actualCnt = _sut.Delete(_id);
            Assert.AreEqual(0, _actualCnt);
            IncidentTypeData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
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
