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
using System.ComponentModel.DataAnnotations;
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
// CompanyId	int	int
// CompanyName	string	nvarchar
//
// ---------------------------------------------------------------------------
//Company table from the NetworkIncident2 database.
//
namespace WebSrv.Models
{
    public class CompanyServerData
    {
        #region "Class Properties"
        //
        /// <summary>
        /// For column Company Id
        /// </summary>
        [Key]
        public int CompanyId { get; set; }
        //
        /// <summary>
        /// For column Company ShortName
        /// </summary>
        [Required(ErrorMessage = "'Company Short Name' is required."),
            MinLength(3, ErrorMessage = "'Company Short Name' must be 6 or up to 12 characters."),
            MaxLength(12, ErrorMessage = "'Company Short Name' must be 12 or less characters.")]
        public string CompanyShortName { get; set; }
        //
        /// <summary>
        /// For column Company Name
        /// </summary>
        [Required(ErrorMessage = "'Company Name' is required."),
            MinLength(3, ErrorMessage = "'Company Name' must be at least 3 characters, up to 80 character."),
            MaxLength(80, ErrorMessage = "'Company Name' must be at least 3 characters, up to 80 character.")]
        public string CompanyName { get; set; }
        //
        /// <summary>
        /// list of servers for the company
        /// </summary>
        public List<ServerData> Servers { get; set; }
        //
        /// <summary>
        /// Create a 'to string'.
        /// </summary>
        public override string ToString()
        {
            //
            StringBuilder _return = new StringBuilder("record:[");
            _return.AppendFormat("CompanyId: {0}, ", CompanyId.ToString());
            _return.AppendFormat("CompanyName: {0}]", CompanyName);
            _return.AppendLine();
            foreach( ServerData _sd in Servers )
                _return.AppendFormat(_sd.ToString()).AppendLine();
            return _return.ToString();
        }
        //
        #endregion
    }
    //
    /// <summary>
    /// CRUD for Company table access.
    /// </summary>
    public class CompanyServerAccess : IDisposable
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
        public CompanyServerAccess()
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
        public CompanyServerAccess(ApplicationDbContext networkIncidentEntities)
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
        //		GetById
        //		CompanyInsert
        //		ServerInsert
        //		CompanyUpdate
        //		ServerUpdate
        //		CompanyDelete
        //      ServerDelete
        //
        #region "Public Access Methods"
        //
        /// <summary>
        /// Return one row of Company
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public CompanyServerData GetById(int companyId)
        {
            CompanyServerData _companyServer = null;
            Company _company = 
                _niEntities.Companies.FirstOrDefault(_r => _r.CompanyId == companyId);
            if (_company != null)
            {
                // See extensions.cs for ToCompanyServerData
                _companyServer = _company.ToCompanyServerData();
            }
            return _companyServer;
        }
        //
        /// <summary>
        /// Insert one row into Company
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="companyName"></param>
        /// <param name="servers"></param>
        /// <returns></returns>
        public int CompanyInsert( CompanyServerData companyServerData )
        {
            int _return = 0;
            Company _company = new Company();
            _company.CompanyShortName = companyServerData.CompanyShortName;
            _company.CompanyName = companyServerData.CompanyName;
            // See extensions.cs for ToServer
            if ( companyServerData.Servers != null )
                foreach (ServerData _s in companyServerData.Servers)
                    _company.Servers.Add(_s.ToServer());
            //
            _niEntities.Companies.Add(_company);
            _niEntities.SaveChanges();
            companyServerData.CompanyId = _company.CompanyId;
            _return = 1 + (companyServerData.Servers != null ? companyServerData.Servers.Count : 0 );	// one row updated
            return _return;
        }
        //
        /// <summary>
        /// 
        /// </summary>
        /// <param name="serverData"></param>
        /// <returns></returns>
        public int ServerInsert( ServerData serverData )
        {
            int _return = 0;
            ApplicationServer _server = serverData.ToServer();
            _server.Company = _niEntities.Companies.FirstOrDefault(_c => _c.CompanyId == _server.CompanyId);
            _niEntities.Servers.Add(_server);
            _niEntities.SaveChanges();
            _return = 1;    // one row updated
            serverData.ServerId = _server.ServerId;
            return _return;
        }
        //
        /// <summary>
        /// Update one row of Company
        /// </summary>
        /// <param name="companyServerData"></param>
        /// <returns></returns>
        public int CompanyUpdate( CompanyServerData companyServerData )
        {
            int _return = 0;
            var _companies =
                from _r in _niEntities.Companies
                where _r.CompanyId == companyServerData.CompanyId
                select _r;
            if (_companies.Count() > 0)
            {
                Company _company = _companies.First();
                if ( _company.CompanyShortName != companyServerData.CompanyShortName )
                    _company.CompanyShortName = companyServerData.CompanyShortName;
                if ( _company.CompanyName != companyServerData.CompanyName )
                    _company.CompanyName = companyServerData.CompanyName;
                _niEntities.SaveChanges();
                _return = 1;	// one row updated
            }
            return _return;
        }
        //
        public int ServerUpdate(ServerData serverData)
        {
            int _return = 0;
            var _servers =
                from _r in _niEntities.Servers
                where _r.ServerId == serverData.ServerId
                select _r;
            if (_servers.Count() > 0)
            {
                ApplicationServer _server = _servers.First();
                //
                if( _server.CompanyId != serverData.CompanyId )
                    _server.CompanyId = serverData.CompanyId;
                if ( _server.ServerShortName != serverData.ServerShortName )
                    _server.ServerShortName = serverData.ServerShortName;
                if ( _server.ServerName != serverData.ServerName )
                    _server.ServerName = serverData.ServerName;
                if ( _server.WebSite != serverData.WebSite )
                    _server.WebSite = serverData.WebSite;
                if ( _server.ServerDescription != serverData.ServerDescription )
                    _server.ServerDescription = serverData.ServerDescription;
                if ( _server.ServerLocation != serverData.ServerLocation )
                    _server.ServerLocation = serverData.ServerLocation;
                if ( _server.FromName != serverData.FromName )
                    _server.FromName = serverData.FromName;
                if ( _server.FromNicName != serverData.FromNicName )
                    _server.FromNicName = serverData.FromNicName;
                if ( _server.FromEmailAddress != serverData.FromEmailAddress )
                    _server.FromEmailAddress = serverData.FromEmailAddress;
                if ( _server.TimeZone != serverData.TimeZone )
                    _server.TimeZone = serverData.TimeZone;
                if ( _server.DST != serverData.DST )
                    _server.DST = serverData.DST;
                if ( _server.TimeZone_DST != serverData.TimeZone_DST )
                    _server.TimeZone_DST = serverData.TimeZone_DST;
                if ( _server.DST_Start != serverData.DST_Start )
                    _server.DST_Start = serverData.DST_Start;
                if ( _server.DST_End != serverData.DST_End )
                    _server.DST_End = serverData.DST_End;
                //
                _niEntities.SaveChanges();
                _return = 1;    // one row updated
                serverData.ServerId = _server.ServerId;
            }
            return _return;
        }
        //
        /// <summary>
        /// Delete one row from Company
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public int CompanyDelete(int companyId)
        {
            int _return = 0;
            var _companies =
                from _r in _niEntities.Companies
                where _r.CompanyId == companyId
                select _r;
            if (_companies.Count() > 0)
            {
                Company _company = _companies.First();
                if (_company.Servers.Count == 0)
                {
                    _niEntities.Companies.Remove(_company);
                    _niEntities.SaveChanges();
                    _return = 1;	// one row updated
                }
                else
                    throw (new ApplicationException("Company: " + 
                        _company.CompanyShortName +
                        " has existing servers, please delete servers first."));
            }
            return _return;
        }
        //
        /// <summary>
        /// Delete one row from Servers
        /// </summary>
        /// <param name="serverId"></param>
        /// <returns></returns>
        public int ServerDelete(int serverId)
        {
            string _invalidServerInUse = "{0}, Server shortName: {1} in use by incident {2}.";
            int _return = 0;
            var _servers =
                from _r in _niEntities.Servers
                where _r.ServerId == serverId
                select _r;
            if (_servers.Count() > 0)
            {
                ApplicationServer _server = _servers.First();
                var netlogs = _niEntities.NetworkLogs.Where(_nl => _nl.ServerId == serverId);
                foreach (NetworkLog _l in netlogs)
                {
                    if (_l.IncidentId > 0)
                        throw new ArgumentNullException(
                            string.Format(_invalidServerInUse, 
                            "CompanyServerAccess.ServerDelete",
                            _server.ServerShortName, _l.IncidentId));
                    _niEntities.NetworkLogs.Remove(_l);
                }
                _niEntities.Servers.Remove(_server);
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
