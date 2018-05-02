//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Reflection;
//
using WebSrv.Models;
using NSG.Identity;
using NSG.Identity.Incidents;
using NSG.Library.Logger;
using System.Data.Entity.Validation;
//
namespace WebSrv.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ServerController : BaseController
    {
        ApplicationDbContext _content;
        ServerStore _serverStore;
        CompanyServerAccess _companyServerAccess;
        //
        /// <summary>
        /// No parameter constructor
        /// </summary>
        public ServerController() :base()
        {
            _content = ApplicationDbContext.Create();
            _serverStore = new ServerStore(_content);
            _companyServerAccess = new CompanyServerAccess(_content);
        }
        //
        /// <summary>
        /// Inject the context, 1 parameter constructor
        /// </summary>
        public ServerController(ApplicationDbContext content) : base()
        {
            _content = content;
            _serverStore = new ServerStore(_content);
        }
        //
        /// <summary>
        /// GET: Server
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View(_content.Companies);
        }
        //
        // GET: Server/Details/5
        public ActionResult Details(int id)
        {
            CompanyServerAccess _csa = new CompanyServerAccess(_content);
            return View(_csa.GetById(id));
        }
        //
        // -------------------------------------------------------------------
        // Create
        //
        /// <summary>
        /// GET: Server/Create
        /// </summary>
        /// <returns></returns>
        public ActionResult Create()
        {
            return View();
        }
        //
        /// <summary>
        /// POST: Server/Create
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult CompanyCreate( CompanyServerData model )
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _companyServerAccess.CompanyInsert( model );
                    return RedirectToAction("Edit", new { id = model.CompanyId });
                }
                else
                    Base_AddErrors(ModelState);
            }
            catch (DbEntityValidationException _entityEx)
            {
                // extension method
                string _errors = _entityEx.EntityValidationErrors.GetDbValidationErrors();
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _errors, _entityEx);
                Base_AddErrors(_entityEx);
            }
            catch ( Exception _ex )
            {
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _ex.Message, _ex);
                Base_AddErrors(_ex);
            }
            return RedirectToAction("Create");
        }
        //
        /// <summary>
        /// POST: Server/Edit/5
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult ServerCreate(ServerData model)
        {
            try
            {
                int _companyId = model.CompanyId;
                if (ModelState.IsValid)
                {
                    if( model.DST && model.DST_Start != null && model.DST_End != null )
                        _companyServerAccess.ServerInsert(model);
                    else
                        Error( "DTS requires start/end dates." );
                }
                else
                    Base_AddErrors(ModelState);
                return RedirectToAction("Edit", new { id = _companyId });
            }
            catch (DbEntityValidationException _entityEx)
            {
                // extension method
                string _errors = _entityEx.EntityValidationErrors.GetDbValidationErrors();
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _errors, _entityEx);
                Base_AddErrors(_entityEx);
            }
            catch (Exception _ex)
            {
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _ex.Message, _ex);
                Base_AddErrors(_ex);
            }
            return RedirectToAction("Index");
        }
        //
        // -------------------------------------------------------------------
        // Edit
        //
        /// <summary>
        /// GET: Server/Edit/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Edit(int id)
        {
            return View(_companyServerAccess.GetById(id));
        }
        //
        /// <summary>
        /// POST: Server/Edit/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult CompanyEdit(int id, CompanyServerData model )
        {
            try
            {
                if ( ModelState.IsValid )
                {
                    int ret = _companyServerAccess.CompanyUpdate( model );
                }
                else
                    Base_AddErrors( ModelState );
                return RedirectToAction("Edit", new { id = model.CompanyId });
            }
            catch (DbEntityValidationException _entityEx)
            {
                string _errors = _entityEx.EntityValidationErrors.GetDbValidationErrors();
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _errors, _entityEx);
                Base_AddErrors(_entityEx);
            }
            catch (Exception _ex)
            {
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _ex.Message, _ex);
                Base_AddErrors(_ex);
            }
            return View();
        }
        //
        /// <summary>
        /// POST: Server/Edit/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult ServerEdit(int id, ServerData model)
        {
            try
            {
                int _companyId = model.CompanyId;
                if (ModelState.IsValid)
                {
                    if ( model.DST && model.DST_Start != null && model.DST_End != null )
                        _companyServerAccess.ServerUpdate( model );
                    else
                        Error( "DTS requires start/end dates." );
                }
                else
                    Base_AddErrors(ModelState);
                return RedirectToAction("Edit", new { id = _companyId } );
            }
            catch (DbEntityValidationException _entityEx)
            {
                // extension method
                string _errors = _entityEx.EntityValidationErrors.GetDbValidationErrors();
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _errors, _entityEx);
                Base_AddErrors(_entityEx);
            }
            catch ( Exception _ex )
            {
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _ex.Message, _ex);
                Base_AddErrors(_ex);
            }
            return RedirectToAction("Index");
        }
        //
        // -------------------------------------------------------------------
        // Delete of company and servers
        //
        /// <summary>
        /// GET: Server/Delete/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Delete(int id)
        {
            return View(_companyServerAccess.GetById(id));
        }
        //
        /// <summary>
        /// POST: Server/CompanyDelete/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult CompanyDelete(int id, CompanyServerData model )
        {
            try
            {
                _companyServerAccess.CompanyDelete(id);
                return RedirectToAction("Index");
            }
            catch (DbEntityValidationException _entityEx)
            {
                string _errors = _entityEx.EntityValidationErrors.GetDbValidationErrors();
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _errors, _entityEx);
                Base_AddErrors(_entityEx);
            }
            catch (Exception _ex)
            {
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _ex.Message, _ex);
                Base_AddErrors(_ex);
            }
            return RedirectToAction("Delete", new { id = id });
        }
        //
        /// <summary>
        /// POST: Server/ServerDelete/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult ServerDelete(int id, CompanyServerData model)
        {
            int _companyId = model.CompanyId;
            try
            {
                _companyServerAccess.ServerDelete(id);
                return RedirectToAction("Delete", new { id = _companyId });
            }
            catch (DbEntityValidationException _entityEx)
            {
                string _errors = _entityEx.EntityValidationErrors.GetDbValidationErrors();
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _errors, _entityEx);
                Base_AddErrors(_entityEx);
            }
            catch (Exception _ex)
            {
                Log.Logger.Log(LoggingLevel.Error, User.Identity.Name, MethodBase.GetCurrentMethod(), _ex.Message, _ex);
                Base_AddErrors(_ex);
            }
            return RedirectToAction("Delete", new { id = _companyId });
        }
        //
    }
}
