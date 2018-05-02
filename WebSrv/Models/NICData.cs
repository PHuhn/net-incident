//
// ---------------------------------------------------------------------------
// Brief Description: 
//
//
// Author: Phil Huhn
// Created Date: 2017/11/13
// ---------------------------------------------------------------------------
// Modified By:
// Modification Date:
// Purpose of Modification:
// ---------------------------------------------------------------------------
//
using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
// NIC	string	varchar
// NICDescription	string	nvarchar
// NICAbuseEmailAddress	string	nvarchar
// NICRestService	string	nvarchar
// NICWebSite	string	nvarchar
//
// ---------------------------------------------------------------------------
//NIC table from the NetworkIncident2 database.
//
namespace WebSrv.Models
{
    public class NICData
    {
        #region "Class Properties"
        //
        /// <summary>
        /// For column NIC
        /// </summary>
        public string NIC { get; set; }
        //
        /// <summary>
        /// For column NICDescription
        /// </summary>
        public string NICDescription { get; set; }
        //
        /// <summary>
        /// For column NICAbuseEmailAddress
        /// </summary>
        public string NICAbuseEmailAddress { get; set; }
        //
        /// <summary>
        /// For column NICRestService
        /// </summary>
        public string NICRestService { get; set; }
        //
        /// <summary>
        /// For column NICWebSite
        /// </summary>
        public string NICWebSite { get; set; }
        //
        /// <summary>
        /// Create a 'to string'.
        /// </summary>
        public override string ToString()
        {
            //
            StringBuilder _return = new StringBuilder("record:[");
            _return.AppendFormat("NIC: {0}, ", NIC);
            _return.AppendFormat("NICDescription: {0}, ", NICDescription);
            _return.AppendFormat("NICAbuseEmailAddress: {0}, ", NICAbuseEmailAddress);
            _return.AppendFormat("NICRestService: {0}, ", NICRestService);
            _return.AppendFormat("NICWebSite: {0}, ", NICWebSite);
            _return.AppendFormat("]");
            return _return.ToString();
        }
        //
        #endregion
    }
    //
    /// <summary>
    /// CRUD for NIC table access.
    /// </summary>
    public class NICAccess : IDisposable
    {
        //
        // -------------------------------------------------------------------
        //	Constructors
        //		parameter-less
        //
        ApplicationDbContext _niEntities = null;
        bool _external = false;
        //
        #region "Constructors"
        //
        /// <summary>
        /// Create a new object using parameter-less (default) constructor.
        /// </summary>
        public NICAccess()
        {
            //
            _niEntities = ApplicationDbContext.Create();
            _external = false;
            //
        }
        //
        /// <summary>
        /// Create a one parameter constructor.
        /// </summary>
        public NICAccess(ApplicationDbContext networkIncidentEntities)
        {
            //
            _niEntities = networkIncidentEntities;
            _external = true;
            //
        }
        //
        /// <summary>
        /// Cleanup resources.
        /// </summary>
        public void Dispose()
        {
            //
            if (_external == false)
            {
                _niEntities.Dispose();
            }
            //
        }
        //
        #endregion
        //
        // -------------------------------------------------------------------
        //	Public Access Methods
        //		List
        //		GetByPrimaryKey
        //		Insert
        //		Update
        //		Delete
        //
        #region "Public Access Methods"
        //
        // Return an IQueryable of NIC
        //
        private IQueryable<NICData> ListNICQueryable()
        {
            return
                from _r in _niEntities.NICs
                select new NICData()
                {
                    NIC = _r.NIC_Id,
                    NICDescription = _r.NICDescription,
                    NICAbuseEmailAddress = _r.NICAbuseEmailAddress,
                    NICRestService = _r.NICRestService,
                    NICWebSite = _r.NICWebSite
                };
        }
        //
        // Return a list with all rows of NIC
        //
        public List<NICData> List()
        {
            List<NICData> _nics = null;
            _nics = ListNICQueryable().ToList();
            return _nics;
        }
        //
        // Return one row of NIC
        //
        public NICData GetByPrimaryKey(string nic)
        {
            NICData _nic = null;
            var _nics = ListNICQueryable().Where(_r => _r.NIC == nic);
            if (_nics.Count() > 0)
            {
                _nic = _nics.First();
            }
            return _nic;
        }
        //
        // Insert one row into NIC
        //
        public int Insert(string nic, string nICDescription, string nICAbuseEmailAddress, string nICRestService, string nICWebSite)
        {
            int _return = 0;
            NIC _nic = new NIC();
            _nic.NIC_Id = nic;
            _nic.NICDescription = nICDescription;
            _nic.NICAbuseEmailAddress = nICAbuseEmailAddress;
            _nic.NICRestService = nICRestService;
            _nic.NICWebSite = nICWebSite;
            // _niEntities.AddToNICs( _nic );
            _niEntities.NICs.Add(_nic);
            _niEntities.SaveChanges();
            _return = 1;	// one row updated
            return _return;
        }
        //
        // Update one row of NIC
        //
        public int Update(string nic, string nICDescription, string nICAbuseEmailAddress, string nICRestService, string nICWebSite)
        {
            int _return = 0;
            var _nics = from _r in _niEntities.NICs
                        where _r.NIC_Id == nic
                        select _r;
            if (_nics.Count() > 0)
            {
                NIC _nic = _nics.First();
                _nic.NICDescription = nICDescription;
                _nic.NICAbuseEmailAddress = nICAbuseEmailAddress;
                _nic.NICRestService = nICRestService;
                _nic.NICWebSite = nICWebSite;
                _niEntities.SaveChanges();
                _return = 1;	// one row updated
            }
            return _return;
        }
        //
        // Delete one row from NIC
        //
        public int Delete(string nicId)
        {
            int _return = 0;
            var _nics = from _r in _niEntities.NICs
                        where _r.NIC_Id == nicId
                        select _r;
            if (_nics.Count() > 0)
            {
                if (_niEntities.Incidents.Where(_i => _i.NIC_Id == nicId).Count() == 0)
                {
                    NIC _nic = _nics.First();
                    _niEntities.NICs.Remove(_nic);
                    _niEntities.SaveChanges();
                    _return = 1;    // one row updated
                }
            }
            return _return;
        }
        //
        #endregion
        //
    }
    //
}
