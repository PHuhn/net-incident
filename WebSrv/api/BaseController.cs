using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebSrv.Models;
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
namespace WebSrv.api
{
    public class BaseController : ApiController
    {
		//
		// -------------------------------------------------------------------
		//	Constructors
		//		parameter-less
		//	  one parameter (strategy pattern)
		//
        protected ApplicationDbContext _incidentEntities = null;
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
		public BaseController( )
		{
			//
            _incidentEntities = ApplicationDbContext.Create();
			_external = false;
			//
		}
		//
		/// <summary>
		/// Create a one parameter constructor.
		/// </summary>
        public BaseController(ApplicationDbContext incidentEntities)
		{
			//
			_incidentEntities = incidentEntities;
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
				_incidentEntities.Dispose();
			}
			base.Dispose();
			//
		}
		//
#endregion
		//
    }
}