using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data.Entity.Validation;
using Microsoft.AspNet.Identity;
//
using NSG.Identity;
using NSG.Identity.Incidents;
using WebSrv.Models;
//
namespace WebSrv.Controllers
{
    public class CompanyEmailTemplateController : BaseController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        //
        private bool IsValidCompany(int companyId )
        {
            string _userId = User.Identity.GetUserId();
            if (string.IsNullOrEmpty(_userId)) return false;
            var _companies = db.Users.Where(u => u.Id == _userId).FirstOrDefault()
                .Servers.Select(s => s.Company).GroupBy(c => new { c.CompanyId })
                .Select(d => d.Key.CompanyId ).ToArray();
            int _index = Array.FindIndex<int>(_companies, x => x == companyId );
            return ( _index < 0 ? false : true );
        }
        //
        private SelectListItem[] GetUsersCompanies( string userId )
        {
            if (string.IsNullOrEmpty(userId))
                return new SelectListItem[0];
            return db.Users.Where(u => u.Id == userId).FirstOrDefault()
                .Servers.Select(s => s.Company).GroupBy(c => new { c.CompanyId, c.CompanyName })
                .Select(d => new SelectListItem() { Value = d.Key.CompanyId.ToString(), Text = d.Key.CompanyName })
                .ToArray();
        }
        // GET: CompanyEmailTemplate
        public ActionResult Index(int? companyId)
        {
            // SelectListItem
            EmailTemplateAccess _access = new EmailTemplateAccess(db);
            string _userId = User.Identity.GetUserId();
            int _companyId = 0;
            var _companies = GetUsersCompanies(_userId);
            if( _companies != null && _companies.Length > 0 )
            {
                int _index = 0;
                if(companyId.HasValue )
                {
                    _index = Array.FindIndex<SelectListItem>(_companies, x => x.Value == companyId.Value.ToString());
                    if (_index < 0)
                        _index = 0;
                }
                _companyId = Convert.ToInt32( _companies[_index].Value );
                _companies[_index].Selected = true;
            }
            CompanyEmailTemplate _viewModel = new CompanyEmailTemplate()
            {
                CompanySelect = _companies.ToList(),
                CompanyTemplates = _access.ListByCompany( _companyId )
            };
            var emailTemplates = db.EmailTemplates.Include(e => e.Company).Include(e => e.IncidentType);
            return View( _viewModel );
        }
        //
        /// <summary>
        /// GET: CompanyEmailTemplate/Details/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Details(int? companyId, int? incidentTypeId)
        {
            if ( !companyId.HasValue || !incidentTypeId.HasValue )
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            if( !IsValidCompany( companyId.Value ) )
            {
                return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
            }
            EmailTemplateAccess _access = new EmailTemplateAccess(db);
            EmailTemplateData _row = _access.GetByPrimaryKey(companyId.Value, incidentTypeId.Value);
            if (_row == null)
            {
                return HttpNotFound();
            }
            return View(_row);
        }
        //
        /// <summary>
        /// GET: CompanyEmailTemplate/Create/?companyId=1
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public ActionResult Create( int? companyId )
        {
            return View(CreateCreateViewModel(new EmailTemplate()) );
        }
        //
        CompanyEmailTemplate CreateCreateViewModel(EmailTemplate template)
        {
            string _userId = User.Identity.GetUserId();
            List<SelectListItem> _companies = GetUsersCompanies(_userId).ToList();
            var _sli = new List<SelectListItem>() {
                new SelectListItem() { Value = "", Text = "- Select a incident type- " }
            }.Union(new SelectList(db.IncidentTypes, "IncidentTypeId", "IncidentTypeShortDesc")).ToList();
            foreach (EmailTemplate _et in db.EmailTemplates)
            {
                _sli.Remove(_sli.Find(it => it.Value == _et.IncidentTypeId.ToString()));
            }
            JavaScriptSerializer _js_slzr = new JavaScriptSerializer();
            IncidentTypeAccess _access = new IncidentTypeAccess(db);
            string _itJsonString = _js_slzr.Serialize(_access.List());
            //
            // ViewBag.CompanyId = _companies;
            // ViewBag.IncidentTypeId = _sli;
            // ViewBag.IncidentType = _itJsonString;
            CompanyEmailTemplate _viewModel = new CompanyEmailTemplate()
            {
                CompanySelect = _companies,
                // List<EmailTemplateData> CompanyTemplates;
                IncidentTypeSelect = _sli,
                IncidentTypeJson = _itJsonString, // JSON string of array of IncidentType
                Template = template
            };
            return _viewModel;
        }
        //
        // POST: CompanyEmailTemplate/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(CompanyEmailTemplate companyEmailTemplate)
        {
            try
            {
                if (companyEmailTemplate != null)
                {
                    if (companyEmailTemplate.Template != null)
                    {
                        db.EmailTemplates.Add(companyEmailTemplate.Template);
                        db.SaveChanges();
                        return RedirectToAction("Index");
                    }
                    else
                    {
                        Error("Company Email Template: empty."); // in BaseController
                    }
                }
                else
                {
                    Error("Company Email Template: empty view model."); // in BaseController
                }
            }
            catch (DbEntityValidationException _entityEx)
            {
                Base_AddErrors(_entityEx);
            }
            catch (Exception _ex)
            {
                Base_AddErrors(_ex);
            }
            return View(CreateCreateViewModel(companyEmailTemplate.Template));
        }
        //
        // GET: CompanyEmailTemplate/Edit/5
        public ActionResult Edit(int? companyId, int? incidentTypeId)
        {
            if (!companyId.HasValue || !incidentTypeId.HasValue)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            if (!IsValidCompany(companyId.Value))
            {
                return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
            }
            EmailTemplateAccess _access = new EmailTemplateAccess(db);
            EmailTemplateData _row = _access.GetByPrimaryKey(companyId.Value, incidentTypeId.Value);
            if (_row == null)
            {
                return HttpNotFound();
            }
            ViewBag.CompanyId = new SelectList(db.Companies, "CompanyId", "CompanyShortName", _row.CompanyId);
            ViewBag.IncidentTypeId = new SelectList(db.IncidentTypes, "IncidentTypeId", "IncidentTypeShortDesc", _row.IncidentTypeId);
            return View(_row);
        }

        // POST: CompanyEmailTemplate/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "CompanyId,IncidentTypeId,SubjectLine,EmailBody,TimeTemplate,ThanksTemplate,LogTemplate,Template,FromServer")] EmailTemplate emailTemplate)
        {
            if (ModelState.IsValid)
            {
                if (!IsValidCompany(emailTemplate.CompanyId))
                {
                    return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
                }
                db.Entry(emailTemplate).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            EmailTemplateAccess _access = new EmailTemplateAccess(db);
            EmailTemplateData _row = _access.GetByPrimaryKey(emailTemplate.CompanyId, emailTemplate.IncidentTypeId);
            if (_row == null)
            {
                return HttpNotFound();
            }
            ViewBag.CompanyId = new SelectList(db.Companies, "CompanyId", "CompanyShortName", emailTemplate.CompanyId);
            ViewBag.IncidentTypeId = new SelectList(db.IncidentTypes, "IncidentTypeId", "IncidentTypeShortDesc", emailTemplate.IncidentTypeId);
            return View(_row);
        }
        //
        /// <summary>
        /// GET: CompanyEmailTemplate/Delete/?companyId=1&incidentTypeId=1026
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="incidentTypeId"></param>
        /// <returns></returns>
        public ActionResult Delete(int? companyId, int? incidentTypeId)
        {
            if (!companyId.HasValue || !incidentTypeId.HasValue)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            if (!IsValidCompany(companyId.Value))
            {
                return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
            }
            EmailTemplateAccess _access = new EmailTemplateAccess(db);
            EmailTemplateData _emailTemplate = _access.GetByPrimaryKey(companyId.Value, incidentTypeId.Value);
            if (_emailTemplate == null)
            {
                return HttpNotFound();
            }
            return View(_emailTemplate);
        }
        //
        /// <summary>
        /// POST: CompanyEmailTemplate/Delete/?companyId=1&incidentTypeId=1026
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="incidentTypeId"></param>
        /// <returns></returns>
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int? companyId, int? incidentTypeId)
        {
            if (!companyId.HasValue || !incidentTypeId.HasValue)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            if (!IsValidCompany(companyId.Value))
            {
                return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
            }
            EmailTemplateAccess _access = new EmailTemplateAccess(db);
            _access.Delete(companyId.Value, incidentTypeId.Value);
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
