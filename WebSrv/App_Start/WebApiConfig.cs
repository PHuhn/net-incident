using System;
using System.Collections.Generic;
//
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Net.Http.Formatting;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
//
namespace WebSrv
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Web API routes
            config.MapHttpAttributeRoutes();
            //
            config.Routes.MapHttpRoute(
                name: "ConfirmEmailRoute",
                routeTemplate: "api/{controller}/ConfirmEmail/{id}",
                defaults: new { controller = "Account", id = RouteParameter.Optional }
            );
            //
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            Console.WriteLine(config);
            //
            // var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            // jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            //
        }
    }
}
