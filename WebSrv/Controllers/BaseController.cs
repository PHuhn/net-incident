//
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web.Mvc;
//
namespace WebSrv.Controllers
{
    public class AlertMessage
    {
        // public string Key { get; set; }
        // public string Code { get; set; }
        public string Level { get; set; }
        public string Message { get; set; }
        public AlertMessage(string level, string message)
        {
            // this.Key = "";
            // this.Code = "";
            this.Level = level;
            this.Message = message;
        }
    }
    public static class AlertLevel
    {
        public const string Error = "error";
        public const string Warning = "warn";
        public const string Success = "success";
        public const string Info = "info";
        //
        public static string[] All
        {
            get { return new[] { Info, Success, Warning, Error }; }
        }
    }
    //
    public class BaseController : Controller
    {
        public List<AlertMessage> Alerts;
        //
        public BaseController()
        {
            TempData.Add("AlertsCount", 0);
            Alerts = new List<AlertMessage>();
            TempData.Add("Alerts", Alerts);
        }
        //
        /// <summary>
        /// Add an error (AlertLevel) AlertMessage to list of Alerts.
        /// </summary>
        /// <param name="message">an error message</param>
        public void Error(string message)
        {
            TempData["AlertsCount"] = 1;
            Alerts.Add(new AlertMessage(AlertLevel.Error.ToString(), message));
            TempData["Alerts"] = Alerts;
        }
        //
        /// <summary>
        /// Add a warning (AlertLevel) AlertMessage to list of Alerts.
        /// </summary>
        /// <param name="message">a warning message</param>
        public void Warning(string message)
        {
            TempData["AlertsCount"] = 1;
            Alerts.Add(new AlertMessage(AlertLevel.Warning.ToString(), message));
            TempData["Alerts"] = Alerts;
        }
        //
        /// <summary>
        /// Add a success (AlertLevel) AlertMessage to list of Alerts.
        /// </summary>
        /// <param name="message">a success message</param>
        public void Success(string message)
        {
            TempData["AlertsCount"] = 1;
            Alerts.Add(new AlertMessage(AlertLevel.Success.ToString(), message));
            TempData["Alerts"] = Alerts;
        }
        //
        /// <summary>
        /// Add a info (AlertLevel) AlertMessage to list of Alerts.
        /// </summary>
        /// <param name="message">a info message</param>
        public void Information(string message)
        {
            TempData["AlertsCount"] = 1;
            Alerts.Add(new AlertMessage(AlertLevel.Info.ToString(), message));
            TempData["Alerts"] = Alerts;
        }
        //
        /// <summary>
        /// iterate call to Error for invalid model state errors.
        /// </summary>
        /// <param name="modelState">ModelState from view model</param>
        public void Base_AddErrors(ModelStateDictionary modelState)
        {
            if( !modelState.IsValid )
                foreach ( ModelError me in (modelState.Values.SelectMany(e => (e.Errors))) )
                    this.Error( me.ErrorMessage );
        }
        //
        /// <summary>
        /// iterate call to Error for identity-result errors.
        /// </summary>
        /// <param name="result">results from identity call</param>
        public void Base_AddErrors(IdentityResult result)
        {
            if( !result.Succeeded )
                foreach ( var errorMessage in result.Errors )
                    this.Error( errorMessage );
        }
        //
        /// <summary>
        /// iterate call to Error for identity-result errors.
        /// </summary>
        /// <param name="result">results from identity call</param>
        public void Base_AddErrors(Exception except)
        {
            except = except.GetBaseException();
            this.Error(except.Message);
        }
        public void Base_AddErrors(DbEntityValidationException entityExcept)
        {
            IEnumerable<DbEntityValidationResult> entityErrors = entityExcept.EntityValidationErrors;
            if (entityErrors.Count() > 0)
            {
                foreach (DbEntityValidationResult _entityErrors in entityErrors)
                {
                    string _entity = _entityErrors.Entry.Entity.GetType().ToString();
                    foreach (var _error in _entityErrors.ValidationErrors)
                    {
                        this.Error(string.Format(
                            "Class: {0} - field: {1}, message: {2}",
                            _entity, _error.PropertyName, _error.ErrorMessage));
                    }
                }
            }
        }
        //
    }
}
//
