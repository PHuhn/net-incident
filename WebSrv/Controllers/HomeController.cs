using System;
using System.Collections.Generic;
//
using System.Web.Mvc;
using System.Reflection;
using WebSrv.Models;
using Microsoft.AspNet.Identity;
//
namespace WebSrv.Controllers
{
    public class HomeController : BaseController
    {
        //
        public HomeController() : base()
        {
        }
        //
        //  home/index
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            return View();
        }
        //
        //  home/About
        public ActionResult About()
        {
            Assembly _asm = Assembly.GetExecutingAssembly();
            var _about = new AboutViewModel();
            _about.Version = ((System.Reflection.AssemblyFileVersionAttribute)_asm.GetCustomAttributes(typeof(System.Reflection.AssemblyFileVersionAttribute), false)[0]).Version;
            _about.Product = ((System.Reflection.AssemblyProductAttribute)_asm.GetCustomAttributes(typeof(System.Reflection.AssemblyProductAttribute), false)[0]).Product;
            _about.Copyright = ((System.Reflection.AssemblyCopyrightAttribute)_asm.GetCustomAttributes(typeof(System.Reflection.AssemblyCopyrightAttribute), false)[0]).Copyright;
            _about.Company = ((System.Reflection.AssemblyCompanyAttribute)_asm.GetCustomAttributes(typeof(System.Reflection.AssemblyCompanyAttribute), false)[0]).Company;
            _about.Description = ((System.Reflection.AssemblyDescriptionAttribute)_asm.GetCustomAttributes(typeof(System.Reflection.AssemblyDescriptionAttribute), false)[0]).Description;
            //
            return View(_about);
        }
        //
        //  home/Contact
        public ActionResult Contact()
        {
            ViewBag.Title = "Contact Us";
            return View();
        }
        //
        //  home/index
        public ActionResult Help()
        {
            ViewBag.Title = "Home Page";
            return View();
        }
        //
        //  home/index
        public ActionResult Messages()
        {
            ViewBag.Title = "Home Messages Page";
            Error("This is error alert");
            Warning("This is warning alert");
            Success("This is a success alert");
            Information("This is information alert");
            Information("Thank-you, for everything.");
            //
            ModelState.AddModelError("fake", "This is a fake model-state error");
            Base_AddErrors(ModelState);
            //
            Base_AddErrors( new IdentityResult(
                new string[] { "This is a fake identity-result error" }) );
            //
            return View();
        }
        //
    }
}
