using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebSrv.Models;
using System.Web.Http.Cors;
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
namespace WebSrv.api
{
    [Authorize(Roles = "Public, User, Admin, CompanyAdmin")]
    public class IncidentController : BaseController
    {
        // call base class constructror
        public IncidentController() : base() { }
        public IncidentController(ApplicationDbContext incidentEntities, ApplicationDbContext systemEntities)
            : base(incidentEntities) { }
		//
		// GET: This maps to the R(Read) part of the CRUD operation. This 
		//  will be used to retrieve the required data (representation of data)
		//  from the remote resource.
		// PUT: This maps to the U(Update) part of the CRUD operation. This 
		//  protocol will update the current representation of the data on the
		//  remote server.
		// POST: This maps to the C(Create) part of the CRUD operation. This 
		//  will create a new entry for the current data that is being sent 
		//  to the server.
		// DELETE: This maps to the D(Delete) part of the CRUD operation. 
		//  This will delete the specified data from the remote server. 
		//
        //  GET api/Incident
        //  GET api/Incident/<key>
        //
        #region "restful get"
        //
        // GET api/<controller>
        //
        [HttpGet]
        public IEnumerable<IncidentData> Get()
        {
            IncidentAccess _access = new IncidentAccess(_incidentEntities);
            IEnumerable<IncidentData> _incidents = null;
            _incidents = _access.ListIncidentQueryable()
                .OrderByDescending(_r => _r.IncidentId);
            return _incidents;
        }
        //
        // GET api/<controller>/5
        /// <summary>
        /// /api/Incident/1?mailed=true&closed=true&special=false
        /// </summary>
        /// <param name="id"></param>
        /// <param name="mailed"></param>
        /// <param name="closed"></param>
        /// <param name="special"></param>
        /// <returns></returns>
        public IEnumerable<IncidentData> Get(int id, [FromUri]bool mailed, [FromUri]bool closed, [FromUri]bool special)
        {
            IncidentAccess _access = new IncidentAccess(_incidentEntities);
            IEnumerable<IncidentData> _incidents = null;
            _incidents = _access.ListIncidentQueryable()
                .Where(_r => _r.ServerId == id && 
                    _r.Mailed == mailed && _r.Closed == closed && _r.Special == special)
                .OrderByDescending(_r => _r.IncidentId);
            return _incidents;
        }
        //
        #endregion
        //
        //  DELETE api/Incident/<key>	delete
        //
        #region "restful updates"
        //
        /// <summary>
        /// DELETE api/Incident/<key>
        /// 
        /// Delete one row from Incident
        /// </summary>
        /// <param name="id">IncidentID of the record to delete</param>
        public int Delete(long id)
        {
            IncidentAccess _access = new IncidentAccess(_incidentEntities);
            return _access.Delete(id);
        }
        //
        #endregion
        //
    }
}