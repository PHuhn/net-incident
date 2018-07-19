using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web.Http.Cors;
//
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
//
namespace WebSrv
{
    public static class WebApiConfig
    {
        //
        public static void Register(HttpConfiguration config)
        {
            // Cross-Origin Resource Sharing (CORS)
            const string _keyCorsAllowOrigin = "cors:allowOrigins";
            string _value = NSG.Library.Helpers.Config.GetStringAppSettingConfigValue(_keyCorsAllowOrigin, "http://localhost:4200");
            EnableCorsAttribute _corsOrigin = new EnableCorsAttribute(_value, "*", "*");
            config.EnableCors( );
            //
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            //
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
            //
            config.Formatters.Add(new BrowserJsonFormatter());
            //
            Console.WriteLine(config);
        }
        //
        public class BrowserJsonFormatter : JsonMediaTypeFormatter
        {
            public BrowserJsonFormatter()
            {
                this.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
                this.SerializerSettings.Formatting = Formatting.Indented;
            }
            //
            public override void SetDefaultContentHeaders(Type type, HttpContentHeaders headers, MediaTypeHeaderValue mediaType)
            {
                base.SetDefaultContentHeaders(type, headers, mediaType);
                headers.ContentType = new MediaTypeHeaderValue("application/json");
            }
        }
        //
    }
}
