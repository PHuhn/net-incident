using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using NSG.Identity;
using WebSrv.Models;
//
namespace WebSrv.Controllers
{
    public class EmailTemplateController : BaseController
    {
        //
        private IncidentTypeAccess _access = null;
        //
        public EmailTemplateController()
        {
            ApplicationDbContext db = null;
            db = new ApplicationDbContext();
            _access = new IncidentTypeAccess( db );
        }
        public EmailTemplateController( ApplicationDbContext _db )
        {
            _access = new IncidentTypeAccess( _db );
        }
        //
        /// <summary>
        /// GET: EmailTemplate
        /// </summary>
        /// <returns>
        /// 
        /// </returns>
        public ActionResult Index()
        {
            return View( _access.List().AsEnumerable() );
        }
        //
        /// <summary>
        /// GET: EmailTemplate/Details/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            IncidentTypeData _incidentType = _access.GetByPrimaryKey( id.Value );
            if ( _incidentType == null )
            {
                return HttpNotFound();
            }
            return View( _incidentType );
        }
        //
        /// <summary>
        /// GET: EmailTemplate/Create
        /// </summary>
        /// <returns></returns>
        public ActionResult Create()
        {
            IncidentTypeData _incidentType = _access.GetByShortDesc("Multiple");
            if (_incidentType == null)
            {
                return View();
            }
            _incidentType.IncidentTypeId = 0;
            _incidentType.IncidentTypeShortDesc = "";
            _incidentType.IncidentTypeDesc = "";
            return View(_incidentType);
        }
        //
        // POST: EmailTemplate/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create( IncidentTypeData incidentType)
        {
            if (ModelState.IsValid)
            {
                _access.Insert( incidentType );
                return RedirectToAction("Index");
            }
            return View(incidentType);
        }
        //
        /// <summary>
        /// GET: EmailTemplate/Edit/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            IncidentTypeData _incidentType = _access.GetByPrimaryKey( id.Value );
            if (_incidentType == null)
            {
                return HttpNotFound();
            }
            return View(_incidentType);
        }
        //
        /// <summary>
        /// POST: EmailTemplate/Edit/5
        /// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        /// more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        /// </summary>
        /// <param name="incidentType"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit( IncidentTypeData incidentType )
        {
            if (ModelState.IsValid)
            {
                _access.Update( incidentType );
                return RedirectToAction( "Index" );
            }
            return View( incidentType );
        }
        //
        /// <summary>
        /// GET: EmailTemplate/Delete/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            IncidentTypeData _incidentType = _access.GetByPrimaryKey(id.Value);
            if (_incidentType == null)
            {
                return HttpNotFound();
            }
            return View(_incidentType);
        }

        // POST: EmailTemplate/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            int _ret = _access.Delete(id);
            if (_ret == 0)
            {
                Error(string.Format("Delete of id: {0} failed.", id));
            }
            return RedirectToAction("Index");
        }
        //
        /// <summary>
        /// Cleanup
        /// </summary>
        /// <param name="disposing"></param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _access.Dispose();
            }
            base.Dispose(disposing);
        }
        //
    }
}
