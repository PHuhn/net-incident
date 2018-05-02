//
using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity.Validation;
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
namespace WebSrv.Models
{
    public static class Extensions
    {
        //
        /// <summary>
        /// Extension method...
        /// can be called fluently by the class or as a static method.
        /// </summary>
        /// <param name="incident"></param>
        /// <returns>a populated IncidentData class</returns>
        public static IncidentData ToIncidentData(this Incident incident)
        {
            return new IncidentData()
            {
                IncidentId = incident.IncidentId,
                ServerId = incident.ServerId,
                IPAddress = incident.IPAddress == null ? "" : incident.IPAddress,
                NIC = incident.NIC_Id == null ? "" : incident.NIC_Id,
                NetworkName = incident.NetworkName == null ? "" : incident.NetworkName,
                AbuseEmailAddress = incident.AbuseEmailAddress == null ? "" : incident.AbuseEmailAddress,
                ISPTicketNumber = incident.ISPTicketNumber == null ? "" : incident.ISPTicketNumber,
                Mailed = incident.Mailed,
                Closed = incident.Closed,
                Special = incident.Special,
                Notes = incident.Notes == null ? "" : incident.Notes,
                CreatedDate = incident.CreatedDate,
                IsChanged = false
            };
        }
        //
        /// <summary>
        /// Extension method...
        /// can be called fluently by the class or as a static method.
        /// </summary>
        /// <param name="incidentNote"></param>
        /// <returns>a populated IncidentNoteData class</returns>
        public static IncidentNoteData ToIncidentNoteData(this IncidentNote incidentNote)
        {
            return new IncidentNoteData()
            {
                IncidentNoteId = incidentNote.IncidentNoteId,
                NoteTypeId = incidentNote.NoteTypeId,
                NoteTypeShortDesc = (incidentNote.NoteType == null ? "" : incidentNote.NoteType.NoteTypeShortDesc),
                Note = incidentNote.Note,
                CreatedDate = incidentNote.CreatedDate,
                IsChanged = false
            };
        }
        //
        /// <summary>
        /// Extension method...
        /// can be called fluently by the class or as a static method.
        /// </summary>
        /// <param name="incidentNote"></param>
        /// <returns>a populated IncidentNoteData class</returns>
        public static IncidentNote ToIncidentNote(this IncidentNoteData incidentNote)
        {
            return new IncidentNote()
            {
                IncidentNoteId = incidentNote.IncidentNoteId,
                NoteTypeId = incidentNote.NoteTypeId,
                Note = incidentNote.Note,
                CreatedDate = incidentNote.CreatedDate
            };
        }
        //
        /// <summary>
        /// Extension method...
        /// can be called fluently by the class or as a static method.
        /// </summary>
        /// <param name="networkLog"></param>
        /// <returns>a populated NetworkLogData class</returns>
        public static NetworkLogData ToNetworkLogData(this NetworkLog networkLog)
        {
            return new NetworkLogData()
            {
                NetworkLogId = networkLog.NetworkLogId,
                ServerId = networkLog.ServerId,
                IPAddress = networkLog.IPAddress,
                NetworkLogDate = networkLog.NetworkLogDate,
                Log = networkLog.Log,
                IncidentTypeId = networkLog.IncidentTypeId,
                IncidentTypeShortDesc = networkLog.IncidentType.IncidentTypeShortDesc,
                IncidentId = (networkLog.IncidentId.HasValue ? networkLog.IncidentId.Value : 0),
                Selected = (networkLog.IncidentId.HasValue ? (networkLog.IncidentId.Value > 0 ? true : false) : false),
                IsChanged = false
            };
        }
        //
        /// <summary>
        /// Extension method...
        /// can be called fluently by the class or as a static method.
        /// </summary>
        /// <param name="networkLog"></param>
        /// <returns>a populated NetworkLogData class</returns>
        public static NetworkLog ToNetworkLog(this NetworkLogData networkLog)
        {
            return new NetworkLog()
            {
                NetworkLogId = networkLog.NetworkLogId,
                ServerId = networkLog.ServerId,
                IncidentId = networkLog.IncidentId,
                IPAddress = networkLog.IPAddress,
                NetworkLogDate = networkLog.NetworkLogDate,
                Log = networkLog.Log,
                IncidentTypeId = networkLog.IncidentTypeId,
            };
        }
        //
        /// <summary>
        /// Extension method...
        /// can be called fluently by the class or as a static method.
        /// </summary>
        /// <param name="company"></param>
        /// <returns></returns>
        public static CompanyServerData ToCompanyServerData( this Company company )
        {
            CompanyServerData _csd = new CompanyServerData()
            {
                CompanyId = company.CompanyId,
                CompanyShortName = company.CompanyShortName,
                CompanyName = company.CompanyName,
                // servers must be instantiated incase no servers
                Servers = new List<ServerData>()
                // Servers = company.Servers.AsEnumerable<ApplicationServer>()
                //     .Select(_s => _s.ToServerData()).ToList()
            };
            foreach (ApplicationServer _s in company.Servers)
                _csd.Servers.Add(_s.ToServerData());
            return _csd;
        }
        //
        /// <summary>
        /// Extension method...
        /// can be called fluently by the class or as a static method.
        /// From entity class to DTO
        /// </summary>
        /// <param name="server"></param>
        /// <returns></returns>
        public static ServerData ToServerData(this ApplicationServer server)
        {
            return new ServerData()
            {
                ServerId = server.ServerId,
                CompanyId = server.CompanyId,
                CompanyName = server.Company.CompanyName,
                ServerShortName = server.ServerShortName,
                ServerName = server.ServerName,
                WebSite = server.WebSite,
                ServerDescription = server.ServerDescription,
                ServerLocation = server.ServerLocation,
                FromName = server.FromName,
                FromNicName = server.FromNicName,
                FromEmailAddress = server.FromEmailAddress,
                TimeZone = server.TimeZone,
                DST = server.DST,
                TimeZone_DST = server.TimeZone_DST,
                DST_Start = server.DST_Start,
                DST_End = server.DST_End
            };
        }
        //
        /// <summary>
        /// Extension method...
        /// can be called fluently by the class or as a static method.
        /// From DTO to entity class
        /// </summary>
        /// <param name="server"></param>
        /// <returns></returns>
        public static ApplicationServer ToServer(this ServerData server)
        {
            return new ApplicationServer()
            {
                ServerId = server.ServerId,
                CompanyId = server.CompanyId,
                ServerShortName = server.ServerShortName,
                ServerName = server.ServerName,
                WebSite = server.WebSite,
                ServerDescription = server.ServerDescription,
                ServerLocation = server.ServerLocation,
                FromName = server.FromName,
                FromNicName = server.FromNicName,
                FromEmailAddress = server.FromEmailAddress,
                TimeZone = server.TimeZone,
                DST = server.DST,
                TimeZone_DST = server.TimeZone_DST,
                DST_Start = server.DST_Start,
                DST_End = server.DST_End
            };
        }
        //
        /// <summary>
        /// Extension method...
        /// can be called fluently by the class or as a static method.
        /// From entity class to DTO
        /// </summary>
        /// <param name="nic">the entity class of NIC</param>
        /// <returns>NIC class translated to DTO class</returns>
        public static NICData ToNICData( this NIC nic )
        {
            return new NICData()
            {
                NIC = nic.NIC_Id,
                NICDescription = nic.NICDescription,
                NICAbuseEmailAddress = nic.NICAbuseEmailAddress,
                NICRestService = nic.NICRestService,
                NICWebSite = nic.NICWebSite
            };
        }
        //
        /// <summary>
        /// Extension method...
        /// can be called fluently by the class or as a static method.
        /// From entity class to DTO
        /// This does not translate the selected ServerData...
        /// </summary>
        /// <param name="user">an ApplicationUser instance</param>
        /// <returns>App user class translated to DTO class</returns>
        public static UserServerData ToUserServerData( this ApplicationUser user )
        {
            return new UserServerData()
            {
                Id = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName,
                UserNicName = user.UserNicName,
                Email = user.Email,
                EmailConfirmed = user.EmailConfirmed,
                PhoneNumber = user.PhoneNumber,
                PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                CompanyId = user.CompanyId,
                ServerShortName = "",
                Server = null,
                ServerShortNames = user.Servers.Select(_s => new SelectItem(_s.ServerShortName, _s.ServerName)).ToArray()
            };
        }
        //
        /// <summary>
        /// 
        /// </summary>
        /// <param name="entityErrors"></param>
        /// <returns></returns>
        /// <remarks>
        /// Call as follow:
        ///   catch ( DbEntityValidationException _entityEx)
        ///   {
        ///       Console.WriteLine(GetDbValidationErrors(_entityEx.EntityValidationErrors));
        ///   }
        /// or:
        ///   IEnumerable<DbEntityValidationResult> _errors =
        ///       booksEntity.GetValidationErrors();
        ///   if (_errors.Count() > 0)
        ///   {
        ///       ...
        ///   }
        /// </remarks>
        public static string GetDbValidationErrors(this IEnumerable<DbEntityValidationResult> entityErrors)
        {
            if (entityErrors.Count() > 0)
            {
                StringBuilder _sb = new StringBuilder();
                //
                foreach (DbEntityValidationResult _entityErrors in entityErrors)
                {
                    string _entity = _entityErrors.Entry.Entity.GetType().ToString();
                    foreach (var _error in _entityErrors.ValidationErrors)
                    {
                        _sb.AppendFormat("Class: {0} - field: {1}, message: {2}\n",
                            _entity, _error.PropertyName, _error.ErrorMessage);
                    }
                }
                return _sb.ToString();
            }
            return "";
        }
        //
    }
}
//