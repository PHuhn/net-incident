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
// NetworkLogId	long	bigint
// CompanyId	int	int
// IncidentId	long	bigint
// IPAddress	string	nvarchar
// NetworkLogDate	DateTime	datetime
// Logs	string	nvarchar
// IncidentTypeId	int	int
//
// ---------------------------------------------------------------------------
//NetworkLog table from the NetworkIncident2 database.
//
namespace WebSrv.Models
{
    public class NetworkLogData
    {
        #region "Class Properties"
        //
        /// <summary>
        /// For column NetworkLogId
        /// </summary>
        public long NetworkLogId { get; set; }
        //
        /// <summary>
        /// For column CompanyId
        /// </summary>
        public int ServerId { get; set; }
        //
        /// <summary>
        /// For column IncidentId
        /// </summary>
        public long? IncidentId { get; set; }
        //
        /// <summary>
        /// For column IPAddress
        /// </summary>
        public string IPAddress { get; set; }
        //
        /// <summary>
        /// For column NetworkLogDate
        /// </summary>
        public DateTime NetworkLogDate { get; set; }
        //
        /// <summary>
        /// For column Logs
        /// </summary>
        public string Log { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeId
        /// </summary>
        public int IncidentTypeId { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeShortDesc in IncidentType
        /// </summary>
        public string IncidentTypeShortDesc { get; set; }
        //
        /// <summary>
        /// For pseudo column, for grid selection
        /// </summary>
        public bool Selected { get; set; }
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
            _return.AppendFormat("NetworkLogId: {0}, ", NetworkLogId.ToString());
            _return.AppendFormat("ServerId: {0}, ", ServerId );
            if( IncidentId.HasValue )
                _return.AppendFormat("IncidentId: {0}, ", IncidentId.Value );
            else
                _return.AppendFormat("IncidentId: //, " );
            _return.AppendFormat("IncidentId: {0}, ", IncidentId);
            _return.AppendFormat("IPAddress: {0}, ", IPAddress);
            _return.AppendFormat("NetworkLogDate: {0}, ", NetworkLogDate.ToString());
            _return.AppendFormat("IncidentTypeId: {0}, ", IncidentTypeId.ToString());
            _return.AppendFormat("Selected: {0}, ", Selected.ToString( ));
            _return.AppendFormat("IsChanged: {0}, ", IsChanged.ToString());
            _return.AppendFormat("Log: {0}]", Log);
            return _return.ToString();
        }
        //
        #endregion
    }
    //
    /// <summary>
    /// CRUD for NetworkLog table access.
    /// </summary>
    public class NetworkLogAccess : IDisposable
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
        public NetworkLogAccess()
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
        public NetworkLogAccess(ApplicationDbContext networkIncidentEntities)
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
        /// <summary>
        /// Return an IQueryable of NetworkLog
        /// </summary>
        /// <returns></returns>
        private IQueryable<NetworkLogData> ListNetworkLogQueryable()
        {
            return
                from _r in _niEntities.NetworkLogs
                select new NetworkLogData()
                {
                    NetworkLogId = _r.NetworkLogId,
                    ServerId = _r.ServerId,
                    IPAddress = _r.IPAddress,
                    NetworkLogDate = _r.NetworkLogDate,
                    Log = _r.Log,
                    IncidentTypeId = _r.IncidentTypeId,
                    IncidentTypeShortDesc = _r.IncidentType.IncidentTypeShortDesc,
		            IncidentId = (_r.IncidentId.HasValue ? _r.IncidentId.Value : 0 ),
                    Selected = (_r.IncidentId.HasValue ? (_r.IncidentId.Value > 0 ? true : false) : false),
                    IsChanged = false
                };
        }
        //
        /// <summary>
        /// Return a list with all rows of NetworkLog
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="incidentId"></param>
        /// <param name="closed"></param>
        /// <returns></returns>
        public List<NetworkLogData> ListByIncident( int companyId, long incidentId, bool mailed )
        {
            long?[] incidents;
            if( mailed )
                incidents = new long?[]  { incidentId };
            else
                incidents = new long?[]  { incidentId, (long)0, null };
            List<NetworkLogData> _networkLogs = null;
            _networkLogs = ListNetworkLogQueryable()
                .OrderByDescending( _r => _r.Selected ).ThenBy( _r2 => _r2.NetworkLogDate )
                .Where( _r => _r.ServerId == companyId
                    && incidents.Contains( _r.IncidentId ) ).ToList();
            return _networkLogs;
        }
        //
        // Return one row of NetworkLog
        //
        public NetworkLogData GetByPrimaryKey(long networkLogId)
        {
            NetworkLogData _networkLog = null;
            var _networkLogs = ListNetworkLogQueryable()
                .Where(_r => _r.NetworkLogId == networkLogId);
            if (_networkLogs.Count() > 0)
            {
                _networkLog = _networkLogs.First();
            }
            return _networkLog;
        }
        //
        // Insert one row into NetworkLog
        //
        public int Insert( NetworkLogData data )
        {
            int _return = 0;
            NetworkLog _networkLog = new NetworkLog();
            _networkLog.ServerId = data.ServerId;
            _networkLog.IPAddress = data.IPAddress;
            _networkLog.NetworkLogDate = data.NetworkLogDate;
            _networkLog.Log = data.Log;
            _networkLog.IncidentTypeId = data.IncidentTypeId;
            _niEntities.NetworkLogs.Add(_networkLog);
            _return = 1;	// one row updated
            return _return;
        }
        public int InsertSave(NetworkLogData data)
        {
            int _return = Insert( data );
            _niEntities.SaveChanges();
            return _return;
        }
        //
        // Update one row of NetworkLog
        //
        public int UpdateIncidentId(NetworkLogData data)
        {
            int _return = 0;
            var _networkLogs =
                from _r in _niEntities.NetworkLogs
                where _r.NetworkLogId == data.NetworkLogId
                select _r;
            if (_networkLogs.Count() > 0)
            {
                NetworkLog _networkLog = _networkLogs.First();
                if( _networkLog.IncidentId != data.IncidentId )
                    _networkLog.IncidentId = data.IncidentId;
                _return = 1;	// one row updated
            }
            return _return;
        }
        public int UpdateIncidentIdSave(NetworkLogData data)
        {
            int _return = UpdateIncidentId(data);
            if( _return > 0 )
            {
                _niEntities.SaveChanges();
            }
            return _return;
        }
        //
        // Delete one row from NetworkLog
        //
        public int Delete(long networkLogId)
        {
            int _return = 0;
            var _networkLogs =
                from _r in _niEntities.NetworkLogs
                where _r.NetworkLogId == networkLogId
                select _r;
            if (_networkLogs.Count() > 0)
            {
                NetworkLog _networkLog = _networkLogs.First();
                _niEntities.NetworkLogs.Remove(_networkLog);
                _return = 1;	// one row updated
            }
            return _return;
        }
        public int DeleteSave(long networkLogId)
        {
            int _return = Delete(networkLogId);
            if (_return > 0)
            {
                _niEntities.SaveChanges();
            }
            return _return;
        }
        //
        #endregion
        //
    }
    //
}
