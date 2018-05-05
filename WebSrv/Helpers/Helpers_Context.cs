//
using System;
//
namespace WebSrv.Helpers
{
    public static partial class Helpers
    {
        //
        /// <summary>
        /// Get the current identity user
        /// </summary>
        /// <returns>string</returns>
        public static string GetUserAccount()
        {
            System.Web.HttpContext _current = System.Web.HttpContext.Current;
            string _user = "-unknown-";
            //
            try
            {
                if ((_current != null))
                    _user = _current.User.Identity.Name;
                else
                    _user = System.Environment.UserName;
                if( string.IsNullOrEmpty( _user ) )
                    _user = "-unknown-";
            }
            catch { }
            //
            return _user;
        }
        //
        /// <summary>
        /// Get the requester's ip address
        /// </summary>
        /// <returns>string</returns>
        public static string GetRequestIpAddress()
        {
            System.Web.HttpContext _current = System.Web.HttpContext.Current;
            try
            {
                if (_current != null)
                    return _current.Request.UserHostAddress;
            }
            catch { }
            return "-unknown-";
        }
        //
        /// <summary>
        /// Get the current URL
        /// </summary>
        /// <returns>string</returns>
        public static string GetUrl()
        {
            System.Web.HttpContext _current = System.Web.HttpContext.Current;
            try
            {
                if (_current != null)
                    return _current.Request.Url.ToString();
            }
            catch { }
            return "-unknown-";
        }
    }
}
//
