using System;
using System.Web.Http;
using System.Web.Http.Cors;
//
// Note: periods in requests:
// https://stackoverflow.com/questions/11728846/dots-in-url-causes-404-with-asp-net-mvc-and-iis
namespace WebSrv.api
{
    [Authorize(Roles = "User, Admin, CompanyAdmin")]
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class ServicesController : BaseServiceController
    {
        //
        // [ActionName("ping")]
        /// <summary>
        /// GET api/services/ping/192.169.3.2
        /// </summary>
        /// <param name="ip"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/services/ping/{ip}")]
        public string Ping(string ip)
        {
            return WebSrv.Helpers.Helpers.PingAddress(ip);
        }
        //
        // [ActionName("whois")]
        /// <summary>
        /// GET api/services/whois/192.169.3.2
        /// </summary>
        /// <param name="ip"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/services/whois/{ip}")]
        public string WhoIs(string ip)
        {
            return WebSrv.Helpers.Helpers.WhoIs(ip);
        }
        //
    }
}
