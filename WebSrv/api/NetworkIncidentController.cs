using System;
using System.Collections.Generic;
using System.Reflection;
using System.Web.Http;
using WebSrv.Models;
using System.Web.Http.Cors;
//
using NSG.Identity;
using NSG.Identity.Incidents;
using NSG.Library.Logger;
//
namespace WebSrv.api
{
    [Authorize(Roles = "Public, User, Admin, CompanyAdmin")]
    public class NetworkIncidentController : BaseController
    {
        // call base class constructror
        public NetworkIncidentController() : base() { }
        public NetworkIncidentController(ApplicationDbContext incidentEntities, ApplicationDbContext systemEntities)
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
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "NetworkIncidentController: Get - Invalid request..." };
        }
        //
        // GET api/<controller>/5&serverId=1
        public NetworkIncidentData Get(long id, [FromUri]int serverId)
        {
            NetworkIncidentAccess _access = new NetworkIncidentAccess(_incidentEntities);
            NetworkIncidentData _incidents = null;
            _incidents = _access.GetByPrimaryKey(id, serverId);
            return _incidents;
        }
        //
        //  POST api/ProdCategory           create
        //  PUT api/ProdCategory/<key>      update
        //  DELETE api/ProdCategory/<key>   delete
        //
        #region "restful updates"
        //
        /// <summary>
        /// POST api/<controller>
        /// NetworkIncidentData Insert(NetworkIncidentSave data)
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public NetworkIncidentData Post([FromBody]NetworkIncidentSave data)
        {            //
            try
            {
                NetworkIncidentAccess _access = new NetworkIncidentAccess(_incidentEntities);
                return _access.Insert( data );
            }
            catch (Exception _ex)
            {
                Log.Logger.Log(LoggingLevel.Error, data.user.UserName, MethodBase.GetCurrentMethod(), data.incident.ToString() + _ex.Message, _ex);
                System.Diagnostics.Debug.WriteLine(_ex.ToString());
            }
            return new NetworkIncidentData();
        }
        //
        /// <summary>
        /// PUT api/<controller>/5
        /// NetworkIncidentData Update(NetworkIncidentSave data)
        /// </summary>
        /// <param name="id"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public NetworkIncidentData Put(int id, [FromBody]NetworkIncidentSave value)
        {
            NetworkIncidentAccess _access = new NetworkIncidentAccess(_incidentEntities);
            return _access.Update(value);
        }
        //
        // DELETE api/<controller>/5
        public int Delete(long id)
        {
            IncidentAccess _access = new IncidentAccess(_incidentEntities);
            return _access.Delete(id);
        }
        //
        #endregion // restful updates
        //
    }
}