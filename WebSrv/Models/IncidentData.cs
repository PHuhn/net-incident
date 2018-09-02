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
using System.Data.Entity;
using System.Web.Script.Serialization;
using System.Reflection;
using System.Linq.Expressions;
using System.ComponentModel;
//
using NSG.Library.Logger;
//
using NSG.Identity;
using NSG.Identity.Incidents;
using NSG.PrimeNG.LazyLoading;
//
// IncidentId	long	bigint
// CompanyId	int	int
// IPAddress    string nvarchar
// NIC_Id	string	varchar
// NetworkName	string	nvarchar
// AbuseEmailAddress	string	nvarchar
// ISPTicketNumber	string	varchar
// Mailed	bool	bit
// Closed	bool	bit
// Special	bool	bit
// Notes	string	nvarchar
// CreatedDate	DateTime	datetime
//
// ---------------------------------------------------------------------------
//Incident table from the NetworkIncident2 database.
//
namespace WebSrv.Models
{
	public class IncidentData
	{
#region "Class Properties"
		//
		/// <summary>
		/// For column IncidentId
		/// </summary>
		public long IncidentId { get; set; }
		//
		/// <summary>
		/// For column CompanyId
		/// </summary>
		public int ServerId { get; set; }
		//
		/// <summary>
        /// For column IPAddress
		/// </summary>
        public string IPAddress { get; set; }
        // NVARCHAR(50)
		//
		/// <summary>
		/// For column NIC
		/// </summary>
		public string NIC { get; set; }
		//
		/// <summary>
		/// For column NetworkName
		/// </summary>
		public string NetworkName { get; set; }
		//
		/// <summary>
		/// For column AbuseEmailAddress
		/// </summary>
		public string AbuseEmailAddress { get; set; }
		//
		/// <summary>
		/// For column ISPTicketNumber
		/// </summary>
		public string ISPTicketNumber { get; set; }
		//
		/// <summary>
		/// For column Mailed
		/// </summary>
		public bool Mailed { get; set; }
		//
		/// <summary>
		/// For column Closed
		/// </summary>
		public bool Closed { get; set; }
		//
		/// <summary>
		/// For column Special
		/// </summary>
		public bool Special { get; set; }
		//
		/// <summary>
		/// For column Notes
		/// </summary>
		public string Notes { get; set; }
		//
		/// <summary>
		/// For column CreatedDate
		/// </summary>
		public DateTime CreatedDate { get; set; }
        //
        /// <summary>
        /// For pseudo column, for change tracking
        /// </summary>
        public bool IsChanged { get; set; }
        //
		/// <summary>
		/// Create a 'to string'.
		/// </summary>
		public override string ToString()
		{
			//
			StringBuilder _return = new StringBuilder("record:[");
			_return.AppendFormat( "IncidentId: {0}, ", IncidentId.ToString() );
			_return.AppendFormat( "ServerId: {0}, ", ServerId.ToString() );
            _return.AppendFormat( "IPAddress: {0}, ", IPAddress );
            _return.AppendFormat( "NIC: {0}, ", NIC );
			_return.AppendFormat( "NetworkName: {0}, ", NetworkName );
			_return.AppendFormat( "AbuseEmailAddress: {0}, ", AbuseEmailAddress );
			_return.AppendFormat( "ISPTicketNumber: {0}, ", ISPTicketNumber );
			_return.AppendFormat( "Mailed: {0}, ", Mailed.ToString() );
			_return.AppendFormat( "Closed: {0}, ", Closed.ToString() );
			_return.AppendFormat( "Special: {0}, ", Special.ToString() );
			_return.AppendFormat( "Notes: {0}, ", Notes );
			_return.AppendFormat( "CreatedDate: {0}]", CreatedDate.ToString() );
			return _return.ToString();
		}
		//
#endregion
	}
    //
    public class IncidentPaginationData
    {
        public List<IncidentData> incidents;
        //
        public LazyLoadEvent loadEvent;
        //
        public long totalRecords;
        //
        public string message;
        //
        public IncidentPaginationData()
        {
            incidents = new List<IncidentData>();
            loadEvent = null;
            totalRecords = 0;
            message = "";
        }
    }
    //
    /// <summary>
    /// CRUD for Incident table access.
    /// </summary>
    public class IncidentAccess : IDisposable
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
		public IncidentAccess( )
		{
			//
			_niEntities = ApplicationDbContext.Create( );
			_external = false;
			//
		}
		//
		/// <summary>
		/// Create a one parameter constructor.
		/// </summary>
		public IncidentAccess(ApplicationDbContext networkIncidentEntities)
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
			if (_external == false) {
				_niEntities.Dispose();
			}
			//
		}
		//
#endregion
        //
        public IncidentData EmptyIncidentData(int serverId)
        {
            IncidentData _incid = new IncidentData();
            _incid.IncidentId = 0;
            _incid.ServerId = serverId;
            _incid.IPAddress = "";
            _incid.NIC = "";
            _incid.NetworkName = "";
            _incid.AbuseEmailAddress = "";
            _incid.ISPTicketNumber = "";
            _incid.Mailed = false;
            _incid.Closed = false;
            _incid.Special = false;
            _incid.Notes = "";
            _incid.CreatedDate = DateTime.Now;
            return _incid;
        }
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
		// Return an IQueryable of Incident
		//
		public IQueryable<IncidentData> ListIncidentQueryable()
		{
			return
				from _r in _niEntities.Incidents
				select new IncidentData()
				{
					IncidentId	= _r.IncidentId,
                    ServerId = _r.ServerId,
                    IPAddress = _r.IPAddress == null ? "" : _r.IPAddress,
                    NIC = _r.NIC_Id == null ? "" : _r.NIC_Id,
                    NetworkName = _r.NetworkName == null ? "" : _r.NetworkName,
                    AbuseEmailAddress = _r.AbuseEmailAddress == null ? "" : _r.AbuseEmailAddress,
                    ISPTicketNumber = _r.ISPTicketNumber == null ? "" : _r.ISPTicketNumber,
					Mailed	= _r.Mailed,
					Closed	= _r.Closed,
					Special	= _r.Special,
                    Notes = _r.Notes == null ? "" : _r.Notes,
					CreatedDate	= _r.CreatedDate,
                    IsChanged = false
				};
		}
        //
        /// <summary>
        /// Return a list with filtered rows of Incident
        /// </summary>
        /// <param name="id">Server id</param>
        /// <param name="mailed"></param>
        /// <param name="closed"></param>
        /// <param name="special"></param>
        /// <returns>List of IncidentData</returns>
        public List<IncidentData> ListbyFlags( int id, bool mailed, bool closed, bool special )
		{
			List<IncidentData> _incidents = null;
            _incidents = ListIncidentQueryable()
                .Where(_r => _r.ServerId == id &&
                    _r.Mailed == mailed && _r.Closed == closed && _r.Special == special)
                .OrderByDescending(_r => _r.IncidentId).ToList();
            return _incidents;
        }
        //
        /// <summary>
        /// Return a list with filtered rows of Incident
        /// </summary>
        /// <param name="jsonString">
        /// {"first":0,"rows":3,"sortOrder":1,"filters":{"ServerId":{"value":1,"matchMode":"eq"},"Mailed":{"value":false,"matchMode":"eq"},"Closed":{"value":false,"matchMode":"eq"},"Special":{"value":false,"matchMode":"eq"}},"globalFilter":null}
        /// param>
        /// <returns>List of IncidentData and count</returns>
        public IncidentPaginationData ListByPagination( string jsonString )
        {
            string _user = "unk";
            IncidentPaginationData _return = new IncidentPaginationData();
            try
            {
                JavaScriptSerializer _js_slzr = new JavaScriptSerializer();
                _return.loadEvent = (LazyLoadEvent)_js_slzr.Deserialize(jsonString, typeof(LazyLoadEvent));
                IQueryable<Incident> _incidentQuery = _niEntities.Incidents;
                _incidentQuery = _incidentQuery.LazyFilters(_return.loadEvent);
                if (!string.IsNullOrEmpty(_return.loadEvent.sortField))
                {
                    _incidentQuery = _incidentQuery.LazyOrderBy(_return.loadEvent);
                }
                else // Default sort order
                {
                    _incidentQuery = _incidentQuery.OrderByDescending(_r => _r.IncidentId);
                }
                // 'OrderBy' must be called before the method 'Skip'.
                _incidentQuery = _incidentQuery.LazySkipTake(_return.loadEvent);
                // Execute query and convert from Incident to IncidentData (POCO) ...
                _return.incidents = _incidentQuery
                    .AsEnumerable().Select(incid => incid.ToIncidentData()).ToList();
                _return.totalRecords = GetCountPagination( _return.loadEvent );
            }
            catch ( Exception _ex )
            {
                _return.message = _ex.Message + ": " + _ex.StackTrace;
                Log.Logger.Log(LoggingLevel.Error, _user, MethodBase.GetCurrentMethod(), _ex.Message, _ex );
            }
            return _return;
        }
        //
        /// <summary>
        /// Return a count of filtered rows of Incident
        /// </summary>
        /// <param name="jsonString">
        /// {"first":0,"rows":3,"sortOrder":1,"filters":{"ServerId":{"value":1,"matchMode":"eq"},"Mailed":{"value":false,"matchMode":"eq"},"Closed":{"value":false,"matchMode":"eq"},"Special":{"value":false,"matchMode":"eq"}},"globalFilter":null}
        /// param>
        /// <returns>List of IncidentData</returns>
        public long GetCountPagination( string jsonString )
        {
            JavaScriptSerializer _js_slzr = new JavaScriptSerializer();
            LazyLoadEvent _pagination = (LazyLoadEvent)_js_slzr.Deserialize(jsonString, typeof(LazyLoadEvent));
            return GetCountPagination(_pagination);
        }
        // Return a count of filtered rows of Incident
        private long GetCountPagination(LazyLoadEvent jsonData)
        {
            IQueryable<Incident> _incidentQuery = _niEntities.Incidents;
            _incidentQuery = _incidentQuery.LazyFilters(jsonData);
            long _incidentCount = _incidentQuery.Count();
            return _incidentCount;
        }
        //
        /// <summary>
        /// Return one row of Incident
        /// </summary>
        /// <param name="incidentId"></param>
        /// <returns></returns>
        public IncidentData GetByPrimaryKey(long incidentId)
		{
			IncidentData _incident = null;
			var _incidents = ListIncidentQueryable()
                .Where(_r => _r.IncidentId == incidentId);
			if ( _incidents.Count( ) > 0 )
			{
				_incident = _incidents.First();
			}
			return _incident;
		}
        //
        /// <summary>
        /// Insert one row into Incident without SaveChanges
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public Incident Insert(IncidentData data)
		{
			Incident _incident	= new Incident( );
			_incident.ServerId = data.ServerId;
            _incident.NIC_Id = data.NIC;
            _incident.IPAddress = data.IPAddress;
            _incident.NetworkName = data.NetworkName;
            _incident.AbuseEmailAddress = data.AbuseEmailAddress;
            _incident.ISPTicketNumber = data.ISPTicketNumber;
            _incident.Mailed = data.Mailed;
            _incident.Closed = data.Closed;
            _incident.Special = data.Special;
            _incident.Notes = data.Notes;
			_incident.CreatedDate	= DateTime.Now;
			_niEntities.Incidents.Add( _incident );
            return _incident;
		}
        public int InsertSave(IncidentData data)
        {
            int _return = 0;
            Incident _incident = Insert(data);
            _niEntities.SaveChanges( );
            _return = 1;
            return _return;
        }
        //
        /// <summary>
        /// Update one row of Incident without SaveChanges
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public Incident Update(IncidentData data)
		{
            Incident _incident = null;
            var _incidents = from _r in _niEntities.Incidents
				where _r.IncidentId == data.IncidentId
				select _r;
			if ( _incidents.Count( ) > 0 )
			{
				_incident	= _incidents.First( );
                if( _incident.IPAddress != data.IPAddress )
                    _incident.IPAddress = data.IPAddress;
                if( _incident.NIC_Id != data.NIC )
                    _incident.NIC_Id = data.NIC;
                if( _incident.NetworkName != data.NetworkName )
                    _incident.NetworkName = data.NetworkName;
                if( _incident.AbuseEmailAddress != data.AbuseEmailAddress )
                    _incident.AbuseEmailAddress = data.AbuseEmailAddress;
                if( _incident.ISPTicketNumber != data.ISPTicketNumber )
                    _incident.ISPTicketNumber = data.ISPTicketNumber;
                if( _incident.Mailed != data.Mailed )
                    _incident.Mailed = data.Mailed;
                if( _incident.Closed != data.Closed )
                    _incident.Closed = data.Closed;
                if( _incident.Special != data.Special )
                    _incident.Special = data.Special;
                if( _incident.Notes != data.Notes )
                    _incident.Notes = data.Notes;
			}
			return _incident;
		}
        public int UpdateSave(IncidentData data)
        {
            int _return = 0;
            Incident _incident = Update(data);
            if (_incident != null)
            {
                _niEntities.SaveChanges();
                _return++;
            }
            return _return;
        }
        //
		/// <summary>
        /// Delete one row from Incident
		/// </summary>
		/// <param name="incidentId"></param>
		/// <returns></returns>
		public int Delete(long incidentId)
		{
			int _return = 0;
			var _incidents = from _r in _niEntities.Incidents
				where _r.IncidentId == incidentId
				select _r;
			if ( _incidents.Count( ) > 0 )
			{
				Incident _incident	= _incidents.First( );
                //
                List<NetworkLog> _logs = _niEntities.NetworkLogs.Where(_r => _r.IncidentId == incidentId).ToList();
                foreach (NetworkLog _log in _logs )
                {
                    _log.IncidentId = 0;
                    _return++;
                }
                List<IncidentNote> _notes = _incident.IncidentNotes.ToList()  ;
                foreach (IncidentNote _note in _notes)
                {
                    _niEntities.IncidentNotes.Remove(_note);
                    _return++;
                }
				_niEntities.Incidents.Remove( _incident );
				_niEntities.SaveChanges( );
                _return++;      // one row updated
			}
			return _return;
		}
		//
#endregion
		//
	}
	//
}
