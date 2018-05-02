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
// IncidentTypeId	        int	int
// IncidentTypeShortDesc	string	nvarchar
// IncidentTypeDesc	        string	nvarchar
// IncidentTypeSubjectLine	string	nvarchar
// IncidentTypeEmailTemplate	string	nvarchar
// IncidentTypeTimeTemplate	    string	nvarchar
// IncidentTypeThanksTemplate	string	nvarchar
// IncidentTypeLogTemplate	    string	nvarchar
//
// ---------------------------------------------------------------------------
//IncidentType table from the NetworkIncident2 database.
//
namespace WebSrv.Models
{
    public class IncidentTypeData
    {
        #region "Class Properties"
        //
        /// <summary>
        /// For column IncidentTypeId
        /// </summary>
        public int IncidentTypeId { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeShortDesc
        /// </summary>
        public string IncidentTypeShortDesc { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeDesc
        /// </summary>
        public string IncidentTypeDesc { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeFromServer
        /// </summary>
        public bool IncidentTypeFromServer { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeSubjectLine
        /// </summary>
        public string IncidentTypeSubjectLine { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeEmailTemplate
        /// </summary>
        public string IncidentTypeEmailTemplate { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeTimeTemplate
        /// </summary>
        public string IncidentTypeTimeTemplate { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeThanksTemplate
        /// </summary>
        public string IncidentTypeThanksTemplate { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeLogTemplate
        /// </summary>
        public string IncidentTypeLogTemplate { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeTemplate
        /// </summary>
        public string IncidentTypeTemplate { get; set; }
        //
        /// <summary>
        /// Create a 'to string'.
        /// </summary>
        public override string ToString()
        {
            //
            StringBuilder _return = new StringBuilder("record:[");
            _return.AppendFormat("IncidentTypeId: {0}, ", IncidentTypeId.ToString());
            _return.AppendFormat("IncidentTypeShortDesc: {0}, ", IncidentTypeShortDesc);
            _return.AppendFormat("IncidentTypeDesc: {0}, ", IncidentTypeDesc);
            _return.AppendFormat("IncidentTypeFromServer: {0}, ", IncidentTypeFromServer);
            _return.AppendFormat("IncidentTypeSubjectLine: {0}, ", IncidentTypeSubjectLine);
            _return.AppendFormat("IncidentTypeEmailTemplate: {0}, ", IncidentTypeEmailTemplate);
            _return.AppendFormat("IncidentTypeTimeTemplate: {0}, ", IncidentTypeTimeTemplate);
            _return.AppendFormat("IncidentTypeThanksTemplate: {0}, ", IncidentTypeThanksTemplate);
            _return.AppendFormat("IncidentTypeLogTemplate: {0}, ", IncidentTypeLogTemplate);
            _return.AppendFormat("IncidentTypeTemplate: {0}]", IncidentTypeTemplate);
            return _return.ToString();
        }
        //
        #endregion
    }
    //
    /// <summary>
    /// CRUD for IncidentType table access.
    /// </summary>
    public class IncidentTypeAccess : IDisposable
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
        public IncidentTypeAccess()
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
        public IncidentTypeAccess(ApplicationDbContext networkIncidentEntities)
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
        //	Public Access Methods:
        //		List
        //		GetByPrimaryKey
        //		Insert
        //		Update
        //		Delete
        //
        #region "Public Access Methods"
        //
        /// <summary>
        /// Return an IQueryable of IncidentType
        /// </summary>
        /// <returns>Returns an IQueryable of IncidentType</returns>
        private IQueryable<IncidentTypeData> ListIncidentTypeQueryable()
        {
            return
                from _r in _niEntities.IncidentTypes
                select new IncidentTypeData()
                {
                    IncidentTypeId = _r.IncidentTypeId,
                    IncidentTypeShortDesc = _r.IncidentTypeShortDesc,
                    IncidentTypeDesc = _r.IncidentTypeDesc,
                    IncidentTypeFromServer = _r.IncidentTypeFromServer,
                    IncidentTypeSubjectLine = _r.IncidentTypeSubjectLine,
                    IncidentTypeEmailTemplate = _r.IncidentTypeEmailTemplate,
                    IncidentTypeTimeTemplate = _r.IncidentTypeTimeTemplate,
                    IncidentTypeThanksTemplate = _r.IncidentTypeThanksTemplate,
                    IncidentTypeLogTemplate = _r.IncidentTypeLogTemplate,
                    IncidentTypeTemplate = _r.IncidentTypeTemplate
                };
            // IncidentTypeToFromTemplate IncidentTypeTemplate
        }
        //
        /// <summary>
        /// Return a list with all rows of IncidentType
        /// </summary>
        /// <returns>List of IncidentTypeData</returns>
        public List<IncidentTypeData> List()
        {
            List<IncidentTypeData> _incidentTypes = null;
            _incidentTypes = ListIncidentTypeQueryable().ToList();
            return _incidentTypes;
        }
        //
        /// <summary>
        /// Return one row of IncidentType
        /// </summary>
        /// <param name="incidentTypeId">Incident type id</param>
        /// <returns>A single IncidentTypeData or null</returns>
        public IncidentTypeData GetByPrimaryKey(int incidentTypeId)
        {
            IncidentTypeData _incidentType = null;
            var _incidentTypes = ListIncidentTypeQueryable()
                .Where(_r => _r.IncidentTypeId == incidentTypeId);
            if (_incidentTypes.Count() > 0)
            {
                _incidentType = _incidentTypes.First();
            }
            return _incidentType;
        }
        //
        /// <summary>
        /// Return one row of IncidentType
        /// </summary>
        /// <param name="incidentTypeShortDesc"></param>
        /// <returns></returns>
        public IncidentTypeData GetByShortDesc(string incidentTypeShortDesc)
        {
            IncidentTypeData _incidentType = null;
            var _incidentTypes = ListIncidentTypeQueryable()
                .Where(_r => _r.IncidentTypeShortDesc == incidentTypeShortDesc);
            if (_incidentTypes.Count() > 0)
            {
                _incidentType = _incidentTypes.First();
            }
            return _incidentType;
        }
        //
        /// <summary>
        /// Insert one row into IncidentType
        /// </summary>
        /// <param name="incidentTypeId"></param>
        /// <param name="incidentTypeShortDesc"></param>
        /// <param name="incidentTypeDesc"></param>
        /// <param name="incidentTypeFromServer"></param>
        /// <param name="incidentTypeSubjectLine"></param>
        /// <param name="incidentTypeEmailTemplate"></param>
        /// <param name="incidentTypeTimeTemplate"></param>
        /// <param name="incidentTypeThanksTemplate"></param>
        /// <param name="incidentTypeLogTemplate"></param>
        /// <param name="incidentTypeTemplate"></param>
        /// <returns></returns>
        public int Insert(ref int incidentTypeId, string incidentTypeShortDesc,
            string incidentTypeDesc, bool incidentTypeFromServer, 
            string incidentTypeSubjectLine, string incidentTypeEmailTemplate,
            string incidentTypeTimeTemplate, string incidentTypeThanksTemplate,
            string incidentTypeLogTemplate, string incidentTypeTemplate)
        {
            int _return = 0;
            if (_niEntities.IncidentTypes.Where(_r => _r.IncidentTypeShortDesc == incidentTypeShortDesc).Count() == 0)
            {
                IncidentType _incidentType = new IncidentType();
                _incidentType.IncidentTypeShortDesc = incidentTypeShortDesc;
                _incidentType.IncidentTypeDesc = incidentTypeDesc;
                _incidentType.IncidentTypeFromServer = incidentTypeFromServer;
                _incidentType.IncidentTypeSubjectLine = incidentTypeSubjectLine;
                _incidentType.IncidentTypeEmailTemplate = incidentTypeEmailTemplate;
                _incidentType.IncidentTypeTimeTemplate = incidentTypeTimeTemplate;
                _incidentType.IncidentTypeThanksTemplate = incidentTypeThanksTemplate;
                _incidentType.IncidentTypeLogTemplate = incidentTypeLogTemplate;
                _incidentType.IncidentTypeTemplate = incidentTypeTemplate;
                _niEntities.IncidentTypes.Add(_incidentType);
                _niEntities.SaveChanges();
                incidentTypeId = _incidentType.IncidentTypeId;
                _return = 1;	// one row updated
            }
            return _return;
        }
        public IncidentTypeData Insert( IncidentTypeData incidentType )
        {
            if (_niEntities.IncidentTypes.Where(
                _r => _r.IncidentTypeShortDesc == incidentType.IncidentTypeShortDesc).Count() == 0
                )
            {
                IncidentType _incidentType = new IncidentType();
                _incidentType.IncidentTypeShortDesc = incidentType.IncidentTypeShortDesc;
                _incidentType.IncidentTypeDesc = incidentType.IncidentTypeDesc;
                _incidentType.IncidentTypeFromServer = incidentType.IncidentTypeFromServer;
                _incidentType.IncidentTypeSubjectLine = incidentType.IncidentTypeSubjectLine;
                _incidentType.IncidentTypeEmailTemplate = incidentType.IncidentTypeEmailTemplate;
                _incidentType.IncidentTypeTimeTemplate = incidentType.IncidentTypeTimeTemplate;
                _incidentType.IncidentTypeThanksTemplate = incidentType.IncidentTypeThanksTemplate;
                _incidentType.IncidentTypeLogTemplate = incidentType.IncidentTypeLogTemplate;
                _incidentType.IncidentTypeTemplate = incidentType.IncidentTypeTemplate;
                _niEntities.IncidentTypes.Add(_incidentType);
                _niEntities.SaveChanges();
                //
                incidentType.IncidentTypeId = _incidentType.IncidentTypeId;
                return incidentType;
            }
            return null;
        }
        //
        /// <summary>
        /// Update one row of IncidentType
        /// </summary>
        /// <param name="incidentTypeId"></param>
        /// <param name="incidentTypeShortDesc"></param>
        /// <param name="incidentTypeDesc"></param>
        /// <param name="incidentTypeFromServer"></param>
        /// <param name="incidentTypeSubjectLine"></param>
        /// <param name="incidentTypeEmailTemplate"></param>
        /// <param name="incidentTypeTimeTemplate"></param>
        /// <param name="incidentTypeThanksTemplate"></param>
        /// <param name="incidentTypeLogTemplate"></param>
        /// <param name="incidentTypeTemplate"></param>
        /// <returns></returns>
        public int Update(int incidentTypeId, string incidentTypeShortDesc,
            string incidentTypeDesc, bool incidentTypeFromServer,
            string incidentTypeSubjectLine, string incidentTypeEmailTemplate,
            string incidentTypeTimeTemplate, string incidentTypeThanksTemplate,
            string incidentTypeLogTemplate, string incidentTypeTemplate)
        {
            int _return = 0;
            var _incidentTypes =
                from _r in _niEntities.IncidentTypes
                where _r.IncidentTypeId == incidentTypeId
                select _r;
            if (_incidentTypes.Count() > 0)
            {
                IncidentType _incidentType = _incidentTypes.First();
                _incidentType.IncidentTypeId = incidentTypeId;
                _incidentType.IncidentTypeShortDesc = incidentTypeShortDesc;
                _incidentType.IncidentTypeDesc = incidentTypeDesc;
                _incidentType.IncidentTypeFromServer = incidentTypeFromServer;
                _incidentType.IncidentTypeSubjectLine = incidentTypeSubjectLine;
                _incidentType.IncidentTypeEmailTemplate = incidentTypeEmailTemplate;
                _incidentType.IncidentTypeTimeTemplate = incidentTypeTimeTemplate;
                _incidentType.IncidentTypeThanksTemplate = incidentTypeThanksTemplate;
                _incidentType.IncidentTypeLogTemplate = incidentTypeLogTemplate;
                _incidentType.IncidentTypeTemplate = incidentTypeTemplate;
                _niEntities.SaveChanges();
                _return = 1;	// one row updated
            }
            return _return;
        }
        public int Update( IncidentTypeData incidentType )
        {
            int _return = 0;
            var _incidentTypes =
                from _r in _niEntities.IncidentTypes
                where _r.IncidentTypeId == incidentType.IncidentTypeId
                select _r;
            if (_incidentTypes.Count() > 0)
            {
                IncidentType _incidentType = _incidentTypes.First();
                _incidentType.IncidentTypeShortDesc = incidentType.IncidentTypeShortDesc;
                _incidentType.IncidentTypeDesc = incidentType.IncidentTypeDesc;
                _incidentType.IncidentTypeFromServer = incidentType.IncidentTypeFromServer;
                _incidentType.IncidentTypeSubjectLine = incidentType.IncidentTypeSubjectLine;
                _incidentType.IncidentTypeEmailTemplate = incidentType.IncidentTypeEmailTemplate;
                _incidentType.IncidentTypeTimeTemplate = incidentType.IncidentTypeTimeTemplate;
                _incidentType.IncidentTypeThanksTemplate = incidentType.IncidentTypeThanksTemplate;
                _incidentType.IncidentTypeLogTemplate = incidentType.IncidentTypeLogTemplate;
                _incidentType.IncidentTypeTemplate = incidentType.IncidentTypeTemplate;
                _niEntities.SaveChanges();
                _return = 1;	// one row updated
            }
            return _return;
        }
        //
        /// <summary>
        /// Delete one row from IncidentType
        /// </summary>
        /// <param name="incidentTypeId"></param>
        /// <returns></returns>
        public int Delete(int incidentTypeId)
        {
            int _return = 0;
            if (incidentTypeId > 0) // don't delete all
            {
                var _incidentTypes =
                    from _r in _niEntities.IncidentTypes
                    where _r.IncidentTypeId == incidentTypeId
                    select _r;
                if (_incidentTypes.Count() > 0)
                {
                    if (_niEntities.NetworkLogs.Where(ni => ni.IncidentTypeId == incidentTypeId).Count() == 0)
                    {
                        IncidentType _incidentType = _incidentTypes.First();
                        _niEntities.IncidentTypes.Remove(_incidentType);
                        _niEntities.SaveChanges();
                        _return = 1;	// one row updated
                    }
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
