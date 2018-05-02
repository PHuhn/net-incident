using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
//
using WebSrv.Models;
using NSG.Identity;
using NSG.Identity.Incidents;
//
using NSG.Library.Logger;
//
namespace WebSrv.api
{
    [Authorize(Roles = "User, Admin, CompanyAdmin")]
    public class LogController : ApiController
    {
		//
        protected ApplicationDbContext _systemEntities = null;
        protected bool _external = false;
		//
		//  parameter-less (default)
		//  one parameter  (strategy pattern)
		//  Dispose
		//
#region "Constructors"
		//
		/// <summary>
		/// Create a new object using parameter-less (default) constructor.
		/// </summary>
		public LogController( )
		{
			//
            _systemEntities = ApplicationDbContext.Create();
			_external = false;
			//
		}
		//
		/// <summary>
		/// Create a one parameter constructor.
		/// </summary>
        public LogController(ApplicationDbContext systemEntities)
		{
			//
            _systemEntities = systemEntities;
			_external = true;
			//
		}
		//
		/// <summary>
		/// Cleanup resources.
		/// </summary>
		[NonAction]
		public new void Dispose()
		{
			//
			if (_external == false) {
                _systemEntities.Dispose();
			}
			base.Dispose();
			//
		}
		//
#endregion
		//
        //
        // GET api/<controller>/5
        public string Get(long id)
        {
            //
            string _user = System.Web.HttpContext.Current.User.Identity.Name;
            if (_user == "") _user = System.Environment.UserName;
            LogTest((int)id);
            // return _systemEntities.Logs.FirstOrDefault(_l => _l.Id == id);
            return _user;
        }
        //
        // POST api/<controller>
        public void Post(byte severity, string user, string method, string message, string exception = "")
        {
            Log.Logger.Log(severity, user, method, message, exception);
            //
        }
        [Route("LogTest")]
        public void LogTest(int value)
        {
            //
            string _user = System.Web.HttpContext.Current.User.Identity.Name;
            if (_user == "") _user = System.Environment.UserName;
            Post((byte)LoggingLevel.Info, _user, "test", "This is a test... " + value.ToString());
            //
        }
        //
    }
}