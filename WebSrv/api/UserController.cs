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
    public class UserController : BaseController
    {
        UserAccess _access = null;
        // call base class constructror
        public UserController() : base() {
            _access = new UserAccess(_incidentEntities);
        }
        public UserController(ApplicationDbContext networkIncidentEntities, ApplicationDbContext systemEntities)
            : base(networkIncidentEntities) { }
        //
        /// <summary>
        /// GET api/<controller>/id=5?serverShortName=nsg
        /// </summary>
        /// <param name="id"></param>
        /// <param name="serverShortName"></param>
        /// <returns></returns>
        public UserServerData Get( string id, string serverShortName )
        {
            return _access.GetUserServerByUserName(id, serverShortName);
        }
        // GET api/<controller>
        // public List<UserServerData> Get()
        // POST api/<controller>
        //public void Post([FromBody]string value) { }
        // PUT api/<controller>/5
        //public void Put(int id, [FromBody]string value) { }
        // DELETE api/<controller>/5
        //public void Delete(int id) { }
    }
}