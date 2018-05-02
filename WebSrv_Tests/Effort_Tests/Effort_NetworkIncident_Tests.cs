using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Data.Entity.Core.Objects;
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
    public class Effort_NetworkIncident_Tests
    {
        //
        private static ApplicationDbContext _niEntities = null;
        private static NetworkIncidentAccess _sut = null;
        private static UserServerData _user = null;
        private static ServerData _server = null;
        private static string _entityConnStr = "";
        private static string _fullPath = "";
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
        public void IncidentTestInitialize()
        {
            //
            _niEntities = WebSrv_Tests.Effort_Helper.GetEffortEntity(_entityConnStr, _fullPath);
            _sut = new NetworkIncidentAccess(_niEntities);
            // server information
            _server = new ServerData()
            {
                ServerId = 1,
                CompanyId = 1,
                CompanyName = "Northern Software Group",
                ServerShortName = "nsg memb",
                ServerDescription = "public members site",
                ServerName = "Members services web-site",
                ServerLocation = "We are in Michigan, USA.",
                WebSite = "Web-site address: https://members.nsg.com",
                FromName = "Phil Huhn",
                FromNicName = "",
                FromEmailAddress = "PhilHuhn@yahoo.com",
                TimeZone = "EST (UTC-5)",
                DST = true,
                TimeZone_DST = "EDT (UTC-4)",
                DST_Start = DateTime.Parse("2018-03-11T02:00:00"),
                DST_End = DateTime.Parse("2018-11-05T02:00:00")
            };
            _user = new UserServerData()
            {
				// user
				Id = "422207c6-9210-4f39-ae20-f908ba6f3fcf",
                CompanyId = 1,
                UserName = "Phil",
                Email = "PhilHuhn@yahoo.com",
				FirstName = "Phil",
				LastName = "Huhn",
				FullName = "Phil Huhn",
                UserNicName = "Phil",
				PhoneNumber = "",
                // server
                ServerShortNames = new SelectItem[] { new SelectItem("nsg memb", "NSG members site") },
                ServerShortName = "nsg memb",
                //
            };
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
        [TestMethod(), TestCategory("Effort"), TestCategory("NetworkIncident")]
        public void Effort_NetworkIncident_Insert1_Test()
        {
            int _before = _niEntities.Incidents.Count();
            string ip = "104.42.229.49";
            NetworkIncidentSave _data = new NetworkIncidentSave();
            _data.user = _user;
            _data.deletedNotes = new List<IncidentNoteData>();
            _data.deletedLogs = new List<NetworkLogData>();
            _data.message = "";
            DateTime _idt = new DateTime(2016, 4, 21, 12, 12, 12);
            _data.incident = new IncidentData()
            {
                IncidentId = 0, ServerId = 1, IPAddress = ip,
                NIC = "arin.net", NetworkName = "MSFT", AbuseEmailAddress = "abuse@microsoft.com",
                ISPTicketNumber = "", Mailed = false, Closed = false,
                Special = false, Notes = "", CreatedDate = _idt, IsChanged = true
            };
            _data.incidentNotes = new List<IncidentNoteData>()
            {
                new IncidentNoteData()
                {
                    IncidentNoteId = 0,
                    NoteTypeId = 1, NoteTypeShortDesc = "Ping",
                    Note = "Ping " + ip, CreatedDate = _idt
                }
            };
            //8,1,,"104.42.229.49",04/22/2016 04:34:09,"URL = https://www.mimilk.com/Download.ashx?Category=Files&Id=62'A=0\r\n",2
            //9,1,,"104.42.229.49",04/22/2016 04:31:33,"URL = https://www.mimilk.com/Download.ashx?Category=Files&Id=62'A=0\r\n",2
            long[] ids = new long[] { 8, 9 };
            _data.networkLogs =
                (from _r in _niEntities.NetworkLogs
                where ( ids.Contains( _r.NetworkLogId ) )
                select new NetworkLogData()
                {
                    NetworkLogId = _r.NetworkLogId, ServerId = _r.ServerId,
                    IncidentId = 0, IPAddress = _r.IPAddress,
                    NetworkLogDate = _r.NetworkLogDate, Log = _r.Log,
                    IncidentTypeId = _r.IncidentTypeId,
                    IncidentTypeShortDesc = _r.IncidentType.IncidentTypeShortDesc,
                    Selected = true, IsChanged = true
                }).ToList();
            NetworkIncidentData _ret = _sut.Insert(_data);
            Assert.IsTrue(_ret.incident.IncidentId > 1);
            int _after = _niEntities.Incidents.Count();
            Assert.AreEqual(_before + 1, _after);
        }
        //
        [TestMethod(), TestCategory("Effort"), TestCategory("NetworkIncident")]
        public void Effort_NetworkIncident_Update1_Test()
        {
            NetworkIncidentSave _data = new NetworkIncidentSave();
            string _ip = "104.42.229.49";
            long _id = 2;
            DateTime _idt = new DateTime(2016, 4, 21, 12, 12, 12);
            _data.user = _user;
            _data.deletedNotes = new List<IncidentNoteData>();
            _data.deletedLogs = new List<NetworkLogData>();
            _data.message = "";
            NetworkIncidentData _nid = _sut.GetByPrimaryKey(_id, 1);
            _data.incident = _nid.incident;
            _data.incident.IPAddress = _ip;
            _data.incidentNotes = _nid.incidentNotes;
            // IncidentNoteId < 0 are added
            _data.incidentNotes.Add( new IncidentNoteData()
            {
                IncidentNoteId = -2,
                NoteTypeId = 1, NoteTypeShortDesc = "Ping",
                Note = "Ping " + _ip, CreatedDate = _idt
            });
            //8,1,,"104.42.229.49",04/22/2016 04:34:09,"URL = https://www.mimilk.com/Download.ashx?Category=Files&Id=62'A=0\r\n",2
            //9,1,,"104.42.229.49",04/22/2016 04:31:33,"URL = https://www.mimilk.com/Download.ashx?Category=Files&Id=62'A=0\r\n",2
            long[] ids = new long[] { 8, 9 };
            _data.networkLogs =
                (from _r in _niEntities.NetworkLogs
                 where (ids.Contains(_r.NetworkLogId))
                 select new NetworkLogData()
                 {
                     NetworkLogId = _r.NetworkLogId,
                     ServerId = _r.ServerId,
                     IncidentId = _id,
                     IPAddress = _r.IPAddress,
                     NetworkLogDate = _r.NetworkLogDate,
                     Log = _r.Log,
                     IncidentTypeId = _r.IncidentTypeId,
                     IncidentTypeShortDesc = _r.IncidentType.IncidentTypeShortDesc,
                     Selected = true,
                     IsChanged = true
                 }).ToList();
            _nid.networkLogs[0].IncidentId = 0;
            _nid.networkLogs[0].IsChanged = true;
            _nid.networkLogs[0].Selected = false;
            _data.networkLogs.Add(_nid.networkLogs[0]);
            // call update
            NetworkIncidentData _ret = _sut.Update(_data);
            Assert.AreEqual(2, _ret.incident.IncidentId);
            Console.WriteLine(_ret.networkLogs.Count);
            Assert.IsTrue(_ret.networkLogs.Count > 5);
            Assert.AreEqual(2, _ret.networkLogs.Where(nl => nl.Selected == true).Count());
            Assert.AreEqual(2, _ret.incidentNotes.Count);
        }
        //
    }
}
