// ===========================================================================
//
// ===========================================================================
using System;
using System.Linq;
using System.Reflection;
using System.Collections.Generic;
//
using NSG.Identity;
using NSG.Identity.Incidents;
using NSG.Library;
//
namespace WebSrv.Models
{
    //
    // an implementation of ILogger
    //
    public partial class SQLLogger: NSG.Library.Logger.ILogger, IDisposable
    {
        //
        protected ApplicationDbContext _niEntities = null;
        protected string _application = "";
        //
        public SQLLogger(ApplicationDbContext networkIncidentEntities, string application )
        {
            //
            _niEntities = networkIncidentEntities;
            _application = application;
            //
        }
        //
        /// <summary>
        /// Cleanup resources.
        /// </summary>
        public void Dispose()
        {
            _niEntities.Dispose();
        }
        //
        /// <summary>
        /// Insert one row into Log
        /// </summary>
        /// <param name="severity"></param>
        /// <param name="user"></param>
        /// <param name="method">MethodBase.GetCurrentMethod()</param>
        /// <param name="message"></param>
        /// <param name="exception"></param>
        public long Log(NSG.Library.Logger.LoggingLevel severity, string user, MethodBase method, string message, Exception exception = null)
        {
            string _method = method.DeclaringType.FullName + "." + method.Name;
            string _exception = (exception == null ? "" : exception.ToString());
            return Log((byte)severity, user, _method, message, _exception);
        }
        //
        /// <summary>
        /// Insert one row into Log
        /// </summary>
        /// <param name="severity"></param>
        /// <param name="user"></param>
        /// <param name="method">string</param>
        /// <param name="message"></param>
        /// <param name="exception"></param>
        public long Log(byte severity, string user, string method, string message, string exception = null)
        {
            long _ret = 0;
            try
            {
                int _configLevel = NSG.Library.Helpers.Config.GetIntAppSettingConfigValue("LogLevel", 2);
                if (severity <= Convert.ToByte(_configLevel))
                {
                    NSG.Library.Logger.LoggingLevel _logLevel =
                        (NSG.Library.Logger.LoggingLevel)severity;
                    NSG.Library.Logger.LogData _log = new NSG.Library.Logger.LogData();
                    _log.Date = DateTime.Now;
                    _log.Application = _application;
                    _log.Method = (method.Length > 255 ? method.Substring(0, 255) : method);
                    _log.LogLevel = severity;
                    _log.Level = _logLevel.GetName();  // extension method in Helpers
                    _log.UserAccount = user;
                    _log.Message = (message.Length > 4000 ? message.Substring(0, 4000) : message);
                    _log.Exception = (exception == null ? "" : exception.ToString());
                    _niEntities.Logs.Add(_log);
                    _niEntities.SaveChanges();
                    _ret = _log.Id;
                }
                // id = _log.Id;
            }
            catch (Exception _ex)
            {
                Console.WriteLine(_ex);
            }
            return _ret;
        }
        //
        /// <summary>
        /// Return a string listing.
        /// </summary>
        /// <param name="lastCount">
        ///  Count of last log records to return
        /// </param>
        /// <returns>List of string</returns>
        public List<string> ListString(int lastCount)
        {
            return _niEntities.Logs.OrderByDescending(_l => _l.Id).Take(lastCount)
                .Select(_r => _r.ToString()).ToList();
        }
        //
    }
}
// ===========================================================================
