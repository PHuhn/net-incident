//
using System;
using Microsoft.Owin;
using Owin;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
//
using WebSrv;
//
[assembly: OwinStartup(typeof(NSG.Identity.Startup))]
namespace NSG.Identity
{
    public partial class Startup
    {
        //
        public void Configuration(IAppBuilder app)
        {
            GlobalConfiguration.Configure(WebApiConfig.Register); // v2.1 invoke
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            ConfigureAuth(app);
            // Globally configure logging and replace default List-Logger
            // with SQL-Logger.
            NSG.Library.Logger.Log.Logger = new WebSrv.Models.SQLLogger(
                ApplicationDbContext.Create(),
                WebSrv.Models.Constants.ApplicationLoggerName);
        }
        //
    }
}
//
