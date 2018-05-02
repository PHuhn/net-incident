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
    public class Effort_NICs_Tests
    {
        //
        private static ApplicationDbContext _niEntities = null;
        private static NICAccess _sut = null;
        private static string _entityConnStr = "";
        private static string _fullPath = "";
        private string _nicId = "nic.br";
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
        public static void NICClassInitialize(TestContext testContext)
        {
            _fullPath = WebSrv_Tests.Effort_Helper.CSV_FullPath;
            _entityConnStr = WebSrv_Tests.Effort_Helper.GetConnectionString();
        }
        //
        // Use TestInitialize to run code before running each test
        [TestInitialize()]
        [DeploymentItem("NetIncedentUnitTest\\App_Data", "App_Data")]
        public void NICTestInitialize()
        {
            //
            _niEntities = WebSrv_Tests.Effort_Helper.GetEffortEntity(_entityConnStr, _fullPath);
            _sut = new NICAccess( _niEntities );
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
        public void Effort_NICs_ListByIncident_Test()
        {
            string _id = _nicId;
            List<NICData> _data = _sut.List( );
            Assert.IsTrue(_data.Count > 0);
            foreach (var _row in _data)
                System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NICs_GetByPrimaryKey_Test()
        {
            string _id = _nicId;
            NICData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
            Assert.AreEqual(_row.NIC, _id);
            System.Diagnostics.Debug.WriteLine(_row.ToString());
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NICs_Insert_Test()
        {
            string _id = "FakeNIC.net";
            int _actualCnt = _sut.Insert( _id, "Fake NIC Description", " ", " ", " " );
            Assert.AreEqual(1, _actualCnt);
            NICData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NICs_Update_Test()
        {
            string _id = _nicId;
            NICData _row = _sut.GetByPrimaryKey(_id);
            _row.NICDescription = "123456789 123456789";
            int _rowCnt = _sut.Update(_row.NIC, _row.NICDescription,
                _row.NICAbuseEmailAddress, _row.NICRestService, _row.NICWebSite);
            Assert.AreEqual(_rowCnt, 1);
            NICData _new = _sut.GetByPrimaryKey(_id);
            System.Diagnostics.Debug.WriteLine(_new.ToString());
            Assert.AreEqual(_id, _new.NIC);
            Assert.AreEqual(_row.NICDescription, _new.NICDescription);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NICs_Delete_Test()
        {
            string _id = _nicId;
            int _actualCnt = _sut.Delete(_id);
            Assert.AreEqual(1, _actualCnt);
            NICData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNull(_row);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NICs_DeleteFail_Test()
        {
            string _id = "ripe.net";
            int _actualCnt = _sut.Delete(_id);
            Assert.AreEqual(0, _actualCnt);
            NICData _row = _sut.GetByPrimaryKey(_id);
            Assert.IsNotNull(_row);
        }
        //
        [TestMethod(), TestCategory("Effort")]
        public void Effort_NoteType_Verify_Delete_Test()
        {
            NIC _nc = new NIC() { NIC_Id = "Fake NIC", NICDescription = "Fake NIC", NICAbuseEmailAddress = " ", NICRestService = " ", NICWebSite = " " };
            _niEntities.NICs.Add(_nc);
            _niEntities.SaveChanges();
            NIC _newNIC = _niEntities.NICs.FirstOrDefault(_n => _n.NIC_Id == _nc.NIC_Id);
            Assert.IsNotNull(_newNIC);
            _niEntities.NICs.Remove(_newNIC);
            _niEntities.SaveChanges();
            _newNIC = _niEntities.NICs.FirstOrDefault(_t => _t.NIC_Id == _nc.NIC_Id);
            Assert.IsNull(_newNIC);
        }
        //
    }
}
