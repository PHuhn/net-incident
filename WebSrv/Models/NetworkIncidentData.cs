//
using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Data.Entity.Validation;
using Newtonsoft.Json.Linq;
using SendGrid.Helpers.Mail;
//
using NSG.Library.Logger;
using NSG.Library.EMail;
//
using NSG.Identity;
using NSG.Identity.Incidents;
using System.Web.Script.Serialization;
//
namespace WebSrv.Models
{
    public class NetworkIncidentData
    {
        public IncidentData incident;
        //
        // public string ipAddress;
        //
        public List<IncidentNoteData> incidentNotes;
        public List<IncidentNoteData> deletedNotes;
        //
        public List<NetworkLogData> networkLogs;
        public List<NetworkLogData> deletedLogs;
        //
        public List<IncidentTypeData> typeEmailTemplates;
        //
        public List<SelectItem> NICs;
        //
        public List<SelectItem> incidentTypes;
        //
        public List<SelectItem> noteTypes;
        //
        public string message;
        //
    }
    //
    public class NetworkIncidentSave
    {
        public IncidentData incident;
        //
        public List<IncidentNoteData> incidentNotes;
        public List<IncidentNoteData> deletedNotes;
        //
        public List<NetworkLogData> networkLogs;
        public List<NetworkLogData> deletedLogs;
        //
        public UserServerData user;
        //
        public string message;
        //
    }
    //
    public class NetworkIncidentAccess : BaseAccess
    {
        // call base class constructror
        public NetworkIncidentAccess() : base() { }
        public NetworkIncidentAccess(ApplicationDbContext networkIncidentEntities)
            : base(networkIncidentEntities) { }
        //
        public Incident EmptyIncident(int serverId)
        {
            Incident _incid = new Incident();
            _incid.IncidentId = 0;
            _incid.ServerId = serverId;
            _incid.IPAddress = "";
            _incid.NIC_Id = "";
            _incid.NetworkName = "";
            _incid.AbuseEmailAddress = "";
            _incid.ISPTicketNumber = "";
            _incid.Mailed = false;
            _incid.Closed = false;
            _incid.Special = false;
            _incid.Notes = "";
            _incid.CreatedDate = DateTime.Now;
            //
            _incid.IncidentNotes = new List<IncidentNote>();
            return _incid;
        }
        //
        // -------------------------------------------------------------------
        //
        public NetworkIncidentData GetByPrimaryKey( long incidentId, int serverId )
        {
            string _params = string.Format("Entering with: incidentId: {0}, serverId: {1}", incidentId, serverId);
            Log.Logger.Log(LoggingLevel.Debug, "unknown", MethodBase.GetCurrentMethod(), _params);
            System.Diagnostics.Debug.WriteLine(_params);
            //
            NetworkIncidentData _data = new NetworkIncidentData();
            _data.message = "";
            _data.deletedNotes = new List<IncidentNoteData>();
            _data.deletedLogs = new List<NetworkLogData>();
            SelectItemAccess _sis = new SelectItemAccess(_niEntities);
            NetworkLogAccess _nl = new NetworkLogAccess(_niEntities);
            IncidentTypeAccess _it = new IncidentTypeAccess(_niEntities);
            Incident _incid = null;
            // need the notes data, etc
            if (incidentId > 0)
                _incid = _niEntities.Incidents
                    .Where(_i => _i.IncidentId == incidentId).FirstOrDefault();
            else
                _incid = EmptyIncident( serverId );
            //
            if( _incid != null )
            {
                _data.incident = _incid.ToIncidentData();
                //
                _data.incidentNotes = _incid.IncidentNotes
                    .Where(_r => _r.Incidents.Any(_i => _i.IncidentId == incidentId))
                    .AsEnumerable<IncidentNote>()
                    .Select(_n => _n.ToIncidentNoteData()).ToList();
                //
                _data.networkLogs = _nl.ListByIncident(_incid.ServerId, incidentId, _incid.Mailed);
                //
                _data.typeEmailTemplates = _it.List();
                //
                _data.NICs = _sis.NICs();
                //
                _data.incidentTypes = _sis.IncidentTypes();
                //
                _data.noteTypes = _sis.NoteTypes();
                //
            }
            else
                Log.Logger.Log(LoggingLevel.Error, "unknown", MethodBase.GetCurrentMethod(), "Incident is null.");
            //
            return _data;
        }
        //
        /// <summary>
        /// insert Incident and the attached Notes, then update the logs with
        /// the new incident id.  Delete any logs in the deleted.  Ignore any 
        /// deleted notes, then shouldn't exist yet.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public NetworkIncidentData Insert(NetworkIncidentSave data)
        {
            System.Diagnostics.Debug.WriteLine( data.user.UserName + ' ' + data.incident.IPAddress);
            long _id = 0;
            int _server = data.incident.ServerId;
            //
            try
            {
                Log.Logger.Log(LoggingLevel.Info, data.user.UserName, MethodBase.GetCurrentMethod(), data.incident.ToString());
                IncidentAccess _ia = new IncidentAccess(_niEntities);
                NetworkLogAccess _nla = new NetworkLogAccess(_niEntities);
                Incident _incident = _ia.Insert(data.incident);
                _incident.IncidentNotes = data.incidentNotes
                    .AsEnumerable().Select(itd => itd.ToIncidentNote()).ToList();
                _niEntities.SaveChanges();
                _id = _incident.IncidentId;
                // List<NetworkLogData> networkLogs;
                foreach (NetworkLogData _nl in data.networkLogs.Where(_l => _l.Selected == true) )
                {
                    _nl.IncidentId = _id;
                    _nla.UpdateIncidentId(_nl);
                }
                // List<NetworkLogData> deletedLogs;
                foreach (NetworkLogData _nl in data.deletedLogs)
                {
                    _nla.Delete(_nl.NetworkLogId);
                }
                _niEntities.SaveChanges();
            }
            catch (DbEntityValidationException _entityEx)
            {
                // extension method
                string _errors = _entityEx.EntityValidationErrors.GetDbValidationErrors();
                Log.Logger.Log(LoggingLevel.Error, data.user.UserName, MethodBase.GetCurrentMethod(), data.incident.ToString() + ' ' + _errors, _entityEx);
                System.Diagnostics.Debug.WriteLine(_errors);
            }
            catch (Exception _ex)
            {
                //Logger _logger = new Logger(_niEntities, "NetworkIncident");
                Log.Logger.Log(LoggingLevel.Error, data.user.UserName, MethodBase.GetCurrentMethod(), data.incident.ToString() + _ex.Message, _ex);
                System.Diagnostics.Debug.WriteLine(_ex.ToString());
            }
            return GetByPrimaryKey(_id, _server);
        }
        //
        public NetworkIncidentData Update(NetworkIncidentSave data)
        {
            string _params = string.Format("Entering with: incidentId: {0}, UserName: {1}", data.incident.IncidentId, data.user.UserName);
            System.Diagnostics.Debug.WriteLine(_params);
            //
            long _id = data.incident.IncidentId;
            int _company = data.incident.ServerId;
            Incident _incident = null;
            try
            {
                Log.Logger.Log(LoggingLevel.Info, data.user.UserName, MethodBase.GetCurrentMethod(), data.incident.ToString());
                IncidentAccess _ia = new IncidentAccess(_niEntities);
                NetworkLogAccess _nla = new NetworkLogAccess(_niEntities);
                IncidentNoteAccess _ina = new IncidentNoteAccess(_niEntities);
                IncidentData _incidentBefore = _ia.GetByPrimaryKey(data.incident.IncidentId);
                _incident = _ia.Update(data.incident);
                // Update notes
                foreach (IncidentNoteData _in in data.incidentNotes.Where(_r => _r.IsChanged == true && _r.IncidentNoteId > 0))
                {
                    _ina.Update(_in);
                }
                // Add notes
                foreach (IncidentNoteData _in in data.incidentNotes.Where( _r => _r.IncidentNoteId < 0))
                {
                    _incident.IncidentNotes.Add(_in.ToIncidentNote());
                }
                // Delete notes
                foreach (IncidentNoteData _in in data.deletedNotes)
                {
                    _ina.Delete(_in.IncidentNoteId);
                }
                // Update logs
                foreach (NetworkLogData _nl in data.networkLogs.Where(_l => _l.IsChanged == true))
                {
                    _nla.UpdateIncidentId(_nl);
                }
                // Delete Logs;
                foreach (NetworkLogData _nl in data.deletedLogs)
                {
                    if( _nl.Selected == false )
                        _nla.Delete(_nl.NetworkLogId);
                }
                _niEntities.SaveChanges();
                if(_incidentBefore.Mailed == false && data.incident.Mailed == true)
                    EMailIspReport( data );
            }
            catch (DbEntityValidationException _entityEx)
            {
                // extension method
                string _errors = _entityEx.EntityValidationErrors.GetDbValidationErrors();
                Log.Logger.Log(LoggingLevel.Error, data.user.UserName, MethodBase.GetCurrentMethod(), data.incident.ToString() + ' ' + _errors, _entityEx);
                System.Diagnostics.Debug.WriteLine(_errors);
            }
            catch (Exception _ex)
            {
                Log.Logger.Log(LoggingLevel.Error, data.user.UserName, MethodBase.GetCurrentMethod(), data.incident.ToString() + _ex.Message, _ex);
                System.Diagnostics.Debug.WriteLine(_ex.ToString());
            }
            NetworkIncidentData _networkIncident =
                GetByPrimaryKey(data.incident.IncidentId, data.incident.ServerId);
            return _networkIncident;
        }
        //
        /// <summary>
        /// EMail the last ISP Report
        /// </summary>
        /// <param name="data"></param>
        private void EMailIspReport(NetworkIncidentSave data )
        {
            var _notes = _niEntities.Incidents.Where( i => i.IncidentId == data.incident.IncidentId ).FirstOrDefault()
                .IncidentNotes.Where( n => n.NoteTypeId == Constants.incidentTypeIdOfIspReport ).ToList( );
            if (_notes.Count > 0)
            {
                try
                {
                    IncidentNote _note = _notes[ _notes.Count - 1 ]; // last ISP Rpt
                    // translate the message from json string of sendgring type
                    JavaScriptSerializer j = new JavaScriptSerializer();
                    SendGridMessage _sgm = (SendGridMessage)j.Deserialize(_note.Note, typeof(SendGridMessage));
                    IEMail _email = new EMail( Log.Logger ).NewMailMessage( _sgm ).Send( );
                }
                catch( Exception _ex )
                {
                    Log.Logger.Log(LoggingLevel.Error, data.user.UserName, MethodBase.GetCurrentMethod(), data.incident.ToString() + _ex.Message, _ex);
                }
            }
        }
    }
}
