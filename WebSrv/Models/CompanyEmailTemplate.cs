//
using System;
using System.Collections.Generic;
using System.Web.Mvc;
//
using NSG.Identity.Incidents;
//
namespace WebSrv.Models
{
    public class CompanyEmailTemplate
    {
        public List<SelectListItem> CompanySelect { get; set; }
        public List<SelectListItem> IncidentTypeSelect { get; set; }
        public List<EmailTemplateData> CompanyTemplates { get; set; }
        public string IncidentTypeJson { get; set; } // JSON string of array of IncidentType
        public EmailTemplate Template { get; set; }
    }
}