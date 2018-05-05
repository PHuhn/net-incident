//
// ---------------------------------------------------------------------------
// Brief Description: 
//
//
// Author: Phil Huhn
// Created Date: 2018/01/23
// ---------------------------------------------------------------------------
// Modified By:
// Modification Date:
// Purpose of Modification:
// ---------------------------------------------------------------------------
// ServerId int int
// CompanyId   int int
// ServerShortName string nvarchar
// ServerName string nvarchar
// ServerDescription string nvarchar
// ServerLocation string nvarchar
// FromName string nvarchar
// FromNicName string nvarchar
// FromEmailAddress string nvarchar
// TimeZone string nvarchar
// DST bool bit
// TimeZone_DST string nvarchar
// DST_Start DateTime    datetime
// DST_End DateTime datetime
//
using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
// ---------------------------------------------------------------------------
//Servers table from the NetworkIncident3 database.
//
namespace WebSrv.Models
{
    public class ServerData
    {
        #region "Class Properties"
        //
        /// <summary>
        /// For column ServerId
        /// </summary>
        [Key]
        public int ServerId { get; set; }
        //
        /// <summary>
        /// For column CompanyId
        /// </summary>
        [Range(1, int.MaxValue, ErrorMessage = "'Company Id' must ba a value greater than 0")]
        public int CompanyId { get; set; }
        //
        public string CompanyName { get; set; }
        //
        /// <summary>
        /// For column ServerShortName
        /// </summary>
        [Required(ErrorMessage = "'Server Short Name' is required."),
            MinLength(6, ErrorMessage = "'Server Short Name' must be 6 or up to 12 characters."),
            MaxLength(12, ErrorMessage = "'Server Short Name' must be 12 or less characters.")]
        public string ServerShortName { get; set; }
        //
        /// <summary>
        /// For column ServerName
        /// </summary>
        [Required(ErrorMessage = "'Server Name' is required."), MaxLength(80, ErrorMessage = "'Server Name' must be 80 or less characters.")]
        public string ServerName { get; set; }
        //
        /// <summary>
        /// For column ServerDescription
        /// </summary>
        [Required(ErrorMessage = "'Server Description' is required."), MaxLength(255, ErrorMessage = "'Server Description' must be 255 or less characters.")]
        public string ServerDescription { get; set; }
        //
        /// <summary>
        /// For column ServerLocation
        /// </summary>
        [Required(ErrorMessage = "'Device' is required."), MaxLength(255, ErrorMessage = "'Device' must be 255 or less characters.")]
        public string WebSite { get; set; }
        //
        /// <summary>
        /// For column ServerLocation
        /// </summary>
        [Required(ErrorMessage = "'Server Location' is required."), MaxLength(255, ErrorMessage = "'Server Location' must be 255 or less characters.")]
        public string ServerLocation { get; set; }
        //
        /// <summary>
        /// For column FromName
        /// </summary>
        [Required(ErrorMessage = "'From Name' is required."), MaxLength(255, ErrorMessage = "'From Name' must be 255 or less characters.")]
        public string FromName { get; set; }
        //
        /// <summary>
        /// For column FromNicName
        /// </summary>
        [Required(ErrorMessage = "'From Nic Name' is required."), MaxLength(16, ErrorMessage = "'From Nic Name' must be 16 or less characters.")]
        public string FromNicName { get; set; }
        //
        /// <summary>
        /// For column FromEmailAddress
        /// </summary>
        [Required(ErrorMessage = "'From Email Address' is required."), MaxLength(255, ErrorMessage = "'From Email Address' must be 255 or less characters.")]
        public string FromEmailAddress { get; set; }
        //
        /// <summary>
        /// For column TimeZone
        /// </summary>
        [Required(ErrorMessage = "'Time-Zone' is required."), MaxLength(16, ErrorMessage = "'Time-Zone' must be 16 or less characters.")]
        public string TimeZone { get; set; }
        //
        /// <summary>
        /// For column DST
        /// </summary>
        [Required(ErrorMessage = "'DST' is required.")]
        public bool DST { get; set; }
        //
        /// <summary>
        /// For column TimeZone_DST
        /// </summary>
        [MaxLength(16, ErrorMessage = "'Time-Zone DST' must be 16 or less characters.")]
        public string TimeZone_DST { get; set; }
        //
        /// <summary>
        /// For column DST_Start
        /// </summary>
        [DataType(DataType.DateTime)]
        public DateTime? DST_Start { get; set; }
        //
        /// <summary>
        /// For column DST_End
        /// </summary>
        [DataType(DataType.DateTime)]
        public DateTime? DST_End { get; set; }
        //
        /// <summary>
        /// Create a 'to string'.
        /// </summary>
        public override string ToString()
        {
            //
            StringBuilder _return = new StringBuilder("record:[");
            _return.AppendFormat("ServerId: {0}, ", ServerId.ToString());
            _return.AppendFormat("CompanyId: {0}, ", CompanyId.ToString());
            _return.AppendFormat("ServerShortName: {0}, ", ServerShortName);
            _return.AppendFormat("ServerName: {0}, ", ServerName);
            _return.AppendFormat("ServerDescription: {0}, ", ServerDescription);
            _return.AppendFormat("ServerLocation: {0}, ", ServerLocation);
            _return.AppendFormat("FromName: {0}, ", FromName);
            _return.AppendFormat("FromNicName: {0}, ", FromNicName);
            _return.AppendFormat("FromEmailAddress: {0}, ", FromEmailAddress);
            _return.AppendFormat("TimeZone: {0}, ", TimeZone);
            _return.AppendFormat("DST: {0}, ", DST.ToString());
            _return.AppendFormat("TimeZone_DST: {0}, ", TimeZone_DST);
            if (DST_Start.HasValue)
                _return.AppendFormat("DST_Start: {0}, ", DST_Start.ToString());
            else
                _return.AppendFormat("/DST_Start/, ");
            if (DST_End.HasValue)
                _return.AppendFormat("DST_End: {0}, ", DST_End.ToString());
            else
                _return.AppendFormat("/DST_End/, ");
            _return.AppendFormat("]");
            return _return.ToString();
        }
        //
        #endregion
    }
    //
    /// <summary>
    /// CRUD for Servers table access.
    /// </summary>
    public class ServerAccess : IDisposable
    {
        //
        // -------------------------------------------------------------------
        //	Constructors
        //		parameter-less
        //
        ApplicationDbContext _niEntities = null;
        bool _external = false;
        //
        // -------------------------------------------------------------------
        //  Constructors:
        //      Parameter-less (default) constructor,
        //      One parameter (entity) constructor.
        //
        #region "Constructors"
        //
        /// <summary>
        /// Create a new object using parameter-less (default) constructor.
        /// </summary>
        public ServerAccess()
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
        public ServerAccess(ApplicationDbContext niEntities)
        {
            //
            _niEntities = niEntities;
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
        // Return an IQueryable of Servers
        //
        private IQueryable<ServerData> ListServerQueryable()
        {
            return
                from _r in _niEntities.Servers
                select new ServerData()
                {
                    ServerId = _r.ServerId,
                    CompanyId = _r.CompanyId,
                    CompanyName = _r.Company.CompanyName,
                    ServerShortName = _r.ServerShortName,
                    ServerName = _r.ServerName,
                    ServerDescription = _r.ServerDescription,
                    ServerLocation = _r.ServerLocation,
                    FromName = _r.FromName,
                    FromNicName = _r.FromNicName,
                    FromEmailAddress = _r.FromEmailAddress,
                    TimeZone = _r.TimeZone,
                    DST = _r.DST,
                    TimeZone_DST = _r.TimeZone_DST,
                    DST_Start = _r.DST_Start,
                    DST_End = _r.DST_End
                };
        }
        //
        /// <summary>
        /// Return a list with all rows of Servers
        /// </summary>
        /// <returns>List of ServerData</returns>
        public List<ServerData> List()
        {
            return ListServerQueryable().ToList();
        }
        //
        /// <summary>
        /// Return one row of Servers
        /// </summary>
        /// <param name="serverId"></param>
        /// <returns>A ServerData class</returns>
        public ServerData GetByPrimaryKey(int serverId)
        {
            ServerData _server = null;
            var _servers = ListServerQueryable().Where(_r => _r.ServerId == serverId);
            if (_servers.Count() > 0)
            {
                _server = _servers.First();
            }
            return _server;
        }
        //
        /// <summary>
        /// Insert one row into Servers
        /// </summary>
        /// <param name="serverId"></param>
        /// <param name="companyId"></param>
        /// <param name="serverShortName"></param>
        /// <param name="serverName"></param>
        /// <param name="serverDescription"></param>
        /// <param name="serverLocation"></param>
        /// <param name="fromName"></param>
        /// <param name="fromNicName"></param>
        /// <param name="fromEmailAddress"></param>
        /// <param name="timeZone"></param>
        /// <param name="dST"></param>
        /// <param name="timeZone_DST"></param>
        /// <param name="dST_Start"></param>
        /// <param name="dST_End"></param>
        /// <returns>Inserted row count and ref to new server id</returns>
        public int Insert(ref int serverId, int companyId, string serverShortName,
            string serverName, string serverDescription, string serverLocation,
            string fromName, string fromNicName, string fromEmailAddress, string timeZone,
            bool dST, string timeZone_DST, DateTime dST_Start, DateTime dST_End)
        {
            int _return = 0;
            ApplicationServer _server = new ApplicationServer();
            _server.CompanyId = companyId;
            _server.ServerShortName = serverShortName;
            _server.ServerName = serverName;
            _server.ServerDescription = serverDescription;
            _server.ServerLocation = serverLocation;
            _server.FromName = fromName;
            _server.FromNicName = fromNicName;
            _server.FromEmailAddress = fromEmailAddress;
            _server.TimeZone = timeZone;
            _server.DST = dST;
            _server.TimeZone_DST = timeZone_DST;
            _server.DST_Start = dST_Start;
            _server.DST_End = dST_End;
            _niEntities.Servers.Add(_server);
            _niEntities.SaveChanges();
            _return = 1;    // one row updated
            serverId = _server.ServerId;
            return _return;
        }
        //
        /// <summary>
        /// Update one row of Servers
        /// </summary>
        /// <param name="serverId"></param>
        /// <param name="companyId"></param>
        /// <param name="serverShortName"></param>
        /// <param name="serverName"></param>
        /// <param name="serverDescription"></param>
        /// <param name="serverLocation"></param>
        /// <param name="fromName"></param>
        /// <param name="fromNicName"></param>
        /// <param name="fromEmailAddress"></param>
        /// <param name="timeZone"></param>
        /// <param name="dST"></param>
        /// <param name="timeZone_DST"></param>
        /// <param name="dST_Start"></param>
        /// <param name="dST_End"></param>
        /// <returns>Updated row count</returns>
        public int Update(int serverId, int companyId, string serverShortName, string serverName, string serverDescription, string serverLocation, string fromName, string fromNicName, string fromEmailAddress, string timeZone, bool dST, string timeZone_DST, DateTime dST_Start, DateTime dST_End)
        {
            int _return = 0;
            var _servers =
                from _r in _niEntities.Servers
                where _r.ServerId == serverId
                select _r;
            if (_servers.Count() > 0)
            {
                ApplicationServer _server = _servers.First();
                _server.CompanyId = companyId;
                _server.ServerShortName = serverShortName;
                _server.ServerName = serverName;
                _server.ServerDescription = serverDescription;
                _server.ServerLocation = serverLocation;
                _server.FromName = fromName;
                _server.FromNicName = fromNicName;
                _server.FromEmailAddress = fromEmailAddress;
                _server.TimeZone = timeZone;
                _server.DST = dST;
                _server.TimeZone_DST = timeZone_DST;
                _server.DST_Start = dST_Start;
                _server.DST_End = dST_End;
                _niEntities.SaveChanges();
                _return = 1;    // one row updated
            }
            return _return;
        }
        //
        #endregion
        //
    }
    //
}
