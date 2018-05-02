using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
//
namespace WebSrv.api
{
    [EnableCors(origins: "http://localhost:4200,http://localhost:4201", headers: "*", methods: "*")]
    public class BaseServiceController : ApiController
    {
    }
}