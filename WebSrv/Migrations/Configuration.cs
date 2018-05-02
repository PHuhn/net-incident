using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
//
using NSG.Identity;
using NSG.Identity.Incidents;
using System.Data.Entity.Validation;
using WebSrv.Models;
//
namespace WebSrv.Migrations
{
    //
    internal sealed class Configuration : DbMigrationsConfiguration<NSG.Identity.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true; // false;
            AutomaticMigrationDataLossAllowed = true;
            if (System.Diagnostics.Debugger.IsAttached == false)
            {
                // System.Diagnostics.Debugger.Launch();
            }
        }

        protected override void Seed(NSG.Identity.ApplicationDbContext context)
        {
            //
            //  This method will be called after migrating to the latest version.
            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data.
            //
            //  AspNet Identity
            //
            int _companyId = 1;
            var _uStore = new ApplicationUserStore(context);
            var _userManager = new ApplicationUserManager(_uStore);
            // Using ms default instance, ApplicationRoleManager was returning the following:
            // 	The entity type ApplicationRole is not part of the model for the current context.
            var _rStore = new ApplicationRoleStore(context);
            var _roleManager = new ApplicationRoleManager(_rStore);
            try
            {
                var _company = new Company()
                {
                    CompanyShortName = "NSG",
                    CompanyName = "Northern Software Group"
                };
                context.Companies.AddOrUpdate(c => c.CompanyName, _company);
                context.SaveChanges();
                _companyId = _company.CompanyId;
                //
                var _server = new ApplicationServer()
                {
                    CompanyId = _companyId,
                    ServerShortName = "NSG Memb",
                    ServerName = "Members Web-site",
                    ServerDescription = "Public facing members Web-site",
                    WebSite = "Web-site address: www.mimilk.com",
                    ServerLocation = "We are in Michigan, USA.",
                    FromName = "Phil Huhn",
                    FromNicName = "Phil",
                    FromEmailAddress = "PhilHuhn@yahoo.com",
                    TimeZone = "EST (UTC-5)",
                    DST = true,
                    TimeZone_DST = "EDT (UTC-4)",
                    DST_Start = new DateTime(2018, 3, 11, 2, 0, 0),
                    DST_End = new DateTime(2018, 11, 4, 2, 0, 0)
                };
                context.Servers.AddOrUpdate(s => s.ServerShortName, _server);
                context.SaveChanges();
            }
            catch { }
            //
            var _rolePub = new ApplicationRole() { Id = "pub", Name = "Public" };
            var _roleUsr = new ApplicationRole() { Id = "usr", Name = "User" };
            var _roleAdm = new ApplicationRole() { Id = "adm", Name = "Admin" };
            var _roleCAdm = new ApplicationRole() { Id = "cadm", Name = "CompanyAdmin" };
            try
            {
                context.Roles.AddOrUpdate(r => r.Id, _rolePub);
                context.Roles.AddOrUpdate(r => r.Id, _roleUsr);
                context.Roles.AddOrUpdate(r => r.Id, _roleAdm);
                context.Roles.AddOrUpdate(r => r.Id, _roleCAdm);
            }
            catch { }
            //
            //  Network Incident
            //
            try
            {
                context.NoteTypes.AddOrUpdate(t => t.NoteTypeId,
                    new NoteType() { NoteTypeId = 1, NoteTypeDesc = "Ping", NoteTypeShortDesc = "Ping" },
                    new NoteType() { NoteTypeId = 2, NoteTypeDesc = "WhoIs", NoteTypeShortDesc = "WhoIs" },
                    new NoteType() { NoteTypeId = 3, NoteTypeDesc = "Abuse Report to ISP", NoteTypeShortDesc = "ISP Rpt" },
                    new NoteType() { NoteTypeId = 4, NoteTypeDesc = "Additional Communication from ISP", NoteTypeShortDesc = "ISP Addl" },
                    new NoteType() { NoteTypeId = 5, NoteTypeDesc = "ISP Response", NoteTypeShortDesc = "ISP Resp" }
                );
                context.SaveChanges();
            }
            catch { }
            //
            try
            {
                context.NICs.AddOrUpdate(t => t.NIC_Id,
                    new NIC() { NIC_Id = "afrinic.net", NICDescription = "Africian Network Information Centre", NICAbuseEmailAddress = " ", NICRestService = "http://www.afrinic.net/", NICWebSite = "http://www.afrinic.net/" },
                    new NIC() { NIC_Id = "apnic.net", NICDescription = "Asian-Pacfic Network Information Centre", NICAbuseEmailAddress = "abuse@org.apnic.net", NICRestService = "https://wq.apnic.net/whois-search/static/search.html?query=", NICWebSite = " " },
                    new NIC() { NIC_Id = "arin.net", NICDescription = "Americian (North) Registry of Internet Numbers", NICAbuseEmailAddress = "abuse@arin.net", NICRestService = "http://whois.arin.net/rest/ip/", NICWebSite = "https://www.arin.net/" },
                    new NIC() { NIC_Id = "lacnic.net", NICDescription = "Latin America and Caribbean Network Information Centre", NICAbuseEmailAddress = "abuse@lacnic.net", NICRestService = "https://rdap.lacnic.net/rdap-web/home", NICWebSite = "http://www.lacnic.net/web/lacnic/inicio" },
                    new NIC() { NIC_Id = "jpnic.net", NICDescription = "Japan", NICAbuseEmailAddress = " ", NICRestService = "https://wq.apnic.net/whois-search/static/search.html?query=", NICWebSite = " " },
                    new NIC() { NIC_Id = "nic.br", NICDescription = "Brazilian Network Information Center", NICAbuseEmailAddress = "cert@cert.br", NICRestService = "https://registro.br/2/whois?query=", NICWebSite = " " },
                    new NIC() { NIC_Id = "ripe.net", NICDescription = "Réseaux IP Européens Network Coordination Centre (Europe)", NICAbuseEmailAddress = "abuse@ripe.net", NICRestService = "https://apps.db.ripe.net/db-web-ui/#/query?searchtext=", NICWebSite = "https://www.ripe.net/" },
                    new NIC() { NIC_Id = "twnic.net", NICDescription = "Taiwan NIC", NICAbuseEmailAddress = " ", NICRestService = "https://www.twnic.net.tw/en_index.php", NICWebSite = "https://www.twnic.net.tw/" },
                    new NIC() { NIC_Id = "hostwinds.com", NICDescription = "hostwinds NIC", NICAbuseEmailAddress = " ", NICRestService = " ", NICWebSite = "https://www.hostwinds.com/" },
                    new NIC() { NIC_Id = "unknown", NICDescription = "Unknown", NICAbuseEmailAddress = " ", NICRestService = " ", NICWebSite = " " },
                    new NIC() { NIC_Id = "other", NICDescription = "Other", NICAbuseEmailAddress = " ", NICRestService = " ", NICWebSite = " " }
                );
                context.SaveChanges();
            }
            catch { }
            //
            try
            {
                context.IncidentTypes.AddOrUpdate(t => t.IncidentTypeId,
                    new IncidentType() { IncidentTypeId = 0, IncidentTypeShortDesc = "Unk", IncidentTypeDesc = "Unknown", IncidentTypeFromServer = true, IncidentTypeSubjectLine = "Unknown probe from ${IPAddress}", IncidentTypeEmailTemplate = "Hi\\n\\nStop the intrusion from your IP address ${IPAddress}.\\nThe following IP address probe my network.\\nPlease contain the following reference # in all communications: ${IncidentId}\\n\\n${WebSite}\\n${ServerLocation}\\nIncident times:", IncidentTypeTimeTemplate = "${NetworkLogDate} ${TimeZone}", IncidentTypeThanksTemplate = "\\nThank you,\\n${FromName}\\n================", IncidentTypeLogTemplate = "\\n${Log}\\n--------------------------------", IncidentTypeTemplate = "-" },
                    new IncidentType() { IncidentTypeId = 1, IncidentTypeShortDesc = "Multiple", IncidentTypeDesc = "Multiple Types", IncidentTypeFromServer = true, IncidentTypeSubjectLine = "Network abuse from ${IPAddress}", IncidentTypeEmailTemplate = "Hi\\n\\nStop the intrusion from your IP address ${IPAddress}.\\nThe following IP address probe my network, probing for multiple vulnerabilities.\\nPlease contain the following reference # in all communications: ${IncidentId}\\n\\n${WebSite}\\n${ServerLocation}\\nIncident times:", IncidentTypeTimeTemplate = "${IncidentTypeShortDesc}: ${NetworkLogDate} ${TimeZone}", IncidentTypeThanksTemplate = "\\nThank you,\\n${FromName}\\n================", IncidentTypeLogTemplate = "\\n${Log}\\n--------------------------------", IncidentTypeTemplate = "-" },
                    new IncidentType() { IncidentTypeId = 2, IncidentTypeShortDesc = "SQL", IncidentTypeDesc = "SQL Injection", IncidentTypeFromServer = true, IncidentTypeSubjectLine = "SQL Injection probe from ${IPAddress}", IncidentTypeEmailTemplate = "Hi\\n\\nStop the intrusion from your IP address ${IPAddress}.  This is testing SQL injection vulnerabilities.\\nPlease contain the following reference # in all communications: ${IncidentId}\\n\\n${WebSite}\\n${ServerLocation}\\n\\nIncident times:", IncidentTypeTimeTemplate = "${NetworkLogDate} ${TimeZone}", IncidentTypeThanksTemplate = "\\nThank you,\\n${FromName}\\n================", IncidentTypeLogTemplate = "\\n${Log}\\n--------------------------------", IncidentTypeTemplate = "-" },
                    new IncidentType() { IncidentTypeId = 3, IncidentTypeShortDesc = "PHP", IncidentTypeDesc = "PHP", IncidentTypeFromServer = true, IncidentTypeSubjectLine = "PHP probe from ${IPAddress}", IncidentTypeEmailTemplate = "Hi\\n\\nStop the intrusion from your IP address ${IPAddress}.\\nThe following IP address probe my network, probing for ${IncidentTypeDesc} vulnerabilities.\\nPlease use the following reference # in all communications: ${IncidentId}\\n\\n${WebSite}\\n${ServerLocation}\\n\\nIncident times:", IncidentTypeTimeTemplate = "${NetworkLogDate} ${TimeZone}", IncidentTypeThanksTemplate = "\\nThank you,\\n${FromName}\\n================", IncidentTypeLogTemplate = "\\n${Log}\\n--------------------------------", IncidentTypeTemplate = "-" },
                    new IncidentType() { IncidentTypeId = 4, IncidentTypeShortDesc = "XSS", IncidentTypeDesc = "Cross Site Scripting", IncidentTypeFromServer = true, IncidentTypeSubjectLine = "XSS probe from ${IPAddress}", IncidentTypeEmailTemplate = "Hi\\n\\nStop the intrusion from your IP address ${IPAddress}.\\nThe following IP address probe my network, probing for ${IncidentTypeDesc} vulnerabilities.\\nPlease use the following reference # in all communications: ${IncidentId}\\n\\n${WebSite}\\n${ServerLocation}\\n\\nIncident times:", IncidentTypeTimeTemplate = "${NetworkLogDate} ${TimeZone}", IncidentTypeThanksTemplate = "\\nThank you,\\n${FromName}\\n================", IncidentTypeLogTemplate = "\\n${Log}\\n--------------------------------", IncidentTypeTemplate = "-" },
                    new IncidentType() { IncidentTypeId = 5, IncidentTypeShortDesc = "VS", IncidentTypeDesc = "ViewState", IncidentTypeFromServer = true, IncidentTypeSubjectLine = "ViewState probe from ${IPAddress}", IncidentTypeEmailTemplate = "Hi\\n\\nStop the intrusion from your IP address ${IPAddress}.\\nThe following IP address probe my network, probing for ${IncidentTypeDesc} vulnerabilities.\\nPlease use the following reference # in all communications: ${IncidentId}\\n\\n${WebSite}\\n${ServerLocation}\\n\\nIncident times:", IncidentTypeTimeTemplate = "${NetworkLogDate} ${TimeZone}", IncidentTypeThanksTemplate = "\\nThank you,\\n${FromName}\\n================", IncidentTypeLogTemplate = "\\n${Log}\\n--------------------------------", IncidentTypeTemplate = "-" },
                    new IncidentType() { IncidentTypeId = 6, IncidentTypeShortDesc = "DIR", IncidentTypeDesc = "Directory traversal", IncidentTypeFromServer = true, IncidentTypeSubjectLine = "Directory traversal probe from ${IPAddress}", IncidentTypeEmailTemplate = "Hi\\n\\nStop the intrusion from your IP address ${IPAddress}.\\nThe following IP address probe my network, probing for ${IncidentTypeDesc} vulnerabilities.\\nPlease use the following reference # in all communications: ${IncidentId}\\n\\n${WebSite}\\n${ServerLocation}\\n\\nIncident times:", IncidentTypeTimeTemplate = "${NetworkLogDate} ${TimeZone}", IncidentTypeThanksTemplate = "\\nThank you,\\n${FromName}\\n================", IncidentTypeLogTemplate = "\\n${Log}\\n--------------------------------", IncidentTypeTemplate = "-" }
                );
                context.SaveChanges();
            }
            catch (DbEntityValidationException _entityEx)
            {
                // extension method
                string _errors = _entityEx.EntityValidationErrors.GetDbValidationErrors();
                System.Diagnostics.Debug.WriteLine(_errors);
                throw new DbEntityValidationException(_errors);
            }
            catch (Exception _ex)
            {
                throw (_ex);
            }
            //
        }
        public void SeedDebug(ApplicationDbContext context)
        {
            Seed(context);
        }
    }
}
