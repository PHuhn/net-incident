//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebSrv.Models;
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
namespace WebSrv.Models
{
    public class BaseAccess : IDisposable
    {
        //
        // -------------------------------------------------------------------
        //	Constructors
        //		parameter-less
        //
        protected ApplicationDbContext _niEntities = null;
        protected bool _external = false;
        //
        #region "Constructors"
        //
        /// <summary>
        /// Create a new object using parameter-less (default) constructor.
        /// </summary>
        public BaseAccess()
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
        public BaseAccess(ApplicationDbContext networkIncidentEntities)
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
    }
}
