//namespace WebSrv.Models
// CompanyId	int	int
// IncidentTypeId	int	int
// SubjectLine	string	nvarchar
// EmailTemplate	string	nvarchar
// TimeTemplate	string	nvarchar
// ThanksTemplate	string	nvarchar
// LogTemplate	string	nvarchar
// Template	string	nvarchar
// FromServer	bool	bit

//
// ---------------------------------------------------------------------------
// Brief Description: 
//
//
// Author: Phil Huhn
// Created Date: 2018/10/05
// ---------------------------------------------------------------------------
// Modified By:
// Modification Date:
// Purpose of Modification:
// ---------------------------------------------------------------------------
//
using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
// ---------------------------------------------------------------------------
/// <summary>
/// EmailTemplate table from the NetworkIncident database.
/// </summary>
namespace WebSrv.Models
{
    public class EmailTemplateData
    {
        #region "Class Properties"
        //
        /// <summary>
        /// For column CompanyId
        /// </summary>
        [Key, Column(Order = 1)]
        [Required(ErrorMessage = "CompanyId is required.")]
        public int CompanyId { get; set; }
        //
        /// <summary>
        /// Foreign key description for CompanyId
        /// </summary>
        public string CompanyShortName { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeId
        /// </summary>
        [Key, Column(Order = 2)]
        [Required(ErrorMessage = "IncidentTypeId is required.")]
        public int IncidentTypeId { get; set; }
        //
        /// <summary>
        /// For column IncidentTypeShortDesc
        /// Foreign key description for IncidentTypeId
        /// </summary>
        public string IncidentTypeShortDesc { get; set; }
        //
        /// <summary>
        /// For column SubjectLine
        /// </summary>
        public string SubjectLine { get; set; }
        //
        /// <summary>
        /// For column EmailBody
        /// </summary>
        public string EmailBody { get; set; }
        //
        /// <summary>
        /// For column TimeTemplate
        /// </summary>
        public string TimeTemplate { get; set; }
        //
        /// <summary>
        /// For column ThanksTemplate
        /// </summary>
        public string ThanksTemplate { get; set; }
        //
        /// <summary>
        /// For column LogTemplate
        /// </summary>
        public string LogTemplate { get; set; }
        //
        /// <summary>
        /// For column Template
        /// </summary>
        public string Template { get; set; }
        //
        /// <summary>
        /// For column FromServer
        /// </summary>
        public bool FromServer { get; set; }
        //
        /// <summary>
        /// Create a 'to string'.
        /// </summary>
        public override string ToString()
        {
            //
            StringBuilder _return = new StringBuilder("record:[");
            _return.AppendFormat("CompanyId: {0}, ", CompanyId.ToString());
            _return.AppendFormat("CompanyShortName: {0}, ", CompanyShortName);
            _return.AppendFormat("IncidentTypeId: {0}, ", IncidentTypeId.ToString());
            _return.AppendFormat("IncidentTypeShortDesc: {0}, ", IncidentTypeShortDesc);
            _return.AppendFormat("SubjectLine: {0}, ", SubjectLine);
            _return.AppendFormat("EmailTemplate: {0}, ", EmailBody);
            _return.AppendFormat("TimeTemplate: {0}, ", TimeTemplate);
            _return.AppendFormat("ThanksTemplate: {0}, ", ThanksTemplate);
            _return.AppendFormat("LogTemplate: {0}, ", LogTemplate);
            _return.AppendFormat("Template: {0}, ", Template);
            _return.AppendFormat("FromServer: {0}, ", FromServer.ToString());
            _return.AppendFormat("]");
            return _return.ToString();
        }
        //
        #endregion
    }
    //
    /// <summary>
    /// CRUD for EmailTemplate table access.
    /// </summary>
    public class EmailTemplateAccess : IDisposable
    {
        //
        // -------------------------------------------------------------------
        //	Constructors
        //		parameter-less
        //
        ApplicationDbContext _niEntities = null;
        bool _external = false;
        //
        // -------------------------------------------------------------------
        //  Constructors:
        //      Parameter-less (default) constructor,
        //      One parameter (entity) constructor.
        //
        #region "Constructors"
        //
        /// <summary>
        /// Create a new object using parameter-less (default) constructor.
        /// </summary>
        public EmailTemplateAccess()
        {
            //
            _niEntities = new ApplicationDbContext();
            _external = false;
            //
        }
        //
        /// <summary>
        /// Create a one parameter constructor.
        /// </summary>
        public EmailTemplateAccess(ApplicationDbContext niEntities)
        {
            //
            _niEntities = niEntities;
            _external = true;
            //
        }
        //
        /// <summary>
        /// Cleanup resources.
        /// </summary>
        public void Dispose()
        {
            //
            if (_external == false)
            {
                _niEntities.Dispose();
            }
            //
        }
        //
        #endregion
        //
        // -------------------------------------------------------------------
        //	Public Access Methods
        //		List
        //		GetByPrimaryKey
        //		Insert
        //		Update
        //		Delete
        //
        #region "Public Access Methods"
        //
        // Return an IQueryable of EmailTemplate
        //
        private IQueryable<EmailTemplateData> ListEmailTemplateQueryable()
        {
            return
                from _r in _niEntities.EmailTemplates
                select new EmailTemplateData()
                {
                    CompanyId = _r.CompanyId,
                    CompanyShortName = _r.Company.CompanyShortName,
                    IncidentTypeId = _r.IncidentTypeId,
                    IncidentTypeShortDesc = _r.IncidentType.IncidentTypeShortDesc,
                    SubjectLine = _r.SubjectLine,
                    EmailBody = _r.EmailBody,
                    TimeTemplate = _r.TimeTemplate,
                    ThanksTemplate = _r.ThanksTemplate,
                    LogTemplate = _r.LogTemplate,
                    Template = _r.Template,
                    FromServer = _r.FromServer
                };
        }
        //
        // Return a list with all rows of EmailTemplate
        //
        public List<EmailTemplateData> List()
        {
            List<EmailTemplateData> _emailTemplates = null;
            _emailTemplates = ListEmailTemplateQueryable().ToList();
            return _emailTemplates;
        }
        public List<EmailTemplateData> ListByCompany( int companyId )
        {
            List<EmailTemplateData> _emailTemplates = null;
            _emailTemplates = ListEmailTemplateQueryable().Where(_r => _r.CompanyId == companyId ).ToList();
            return _emailTemplates;
        }
        //
        /// <summary>
        /// Return one row of EmailTemplate
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="incidentTypeId"></param>
        /// <returns></returns>
        public EmailTemplateData GetByPrimaryKey(int companyId, int incidentTypeId)
        {
            EmailTemplateData _emailTemplate = null;
            var _emailTemplates = ListEmailTemplateQueryable().Where(_r => _r.CompanyId == companyId && _r.IncidentTypeId == incidentTypeId);
            if (_emailTemplates.Count() > 0)
            {
                _emailTemplate = _emailTemplates.First();
            }
            return _emailTemplate;
        }
        //
        /// <summary>
        /// Insert one row into EmailTemplate
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="incidentTypeId"></param>
        /// <param name="subjectLine"></param>
        /// <param name="emailBody"></param>
        /// <param name="timeTemplate"></param>
        /// <param name="thanksTemplate"></param>
        /// <param name="logTemplate"></param>
        /// <param name="template"></param>
        /// <param name="fromServer"></param>
        /// <returns></returns>
        public int Insert(int companyId, int incidentTypeId, string subjectLine, string emailBody, string timeTemplate, string thanksTemplate, string logTemplate, string template, bool fromServer)
        {
            int _return = 0;
            EmailTemplate _emailTemplate = new EmailTemplate();
            _emailTemplate.CompanyId = companyId;
            _emailTemplate.IncidentTypeId = incidentTypeId;
            _emailTemplate.SubjectLine = subjectLine;
            _emailTemplate.EmailBody = emailBody;
            _emailTemplate.TimeTemplate = timeTemplate;
            _emailTemplate.ThanksTemplate = thanksTemplate;
            _emailTemplate.LogTemplate = logTemplate;
            _emailTemplate.Template = template;
            _emailTemplate.FromServer = fromServer;
            _niEntities.EmailTemplates.Add(_emailTemplate);
            _niEntities.SaveChanges();
            _return = 1;    // one row updated
            return _return;
        }
        //
        /// <summary>
        /// Update one row of EmailTemplate
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="incidentTypeId"></param>
        /// <param name="subjectLine"></param>
        /// <param name="emailBody"></param>
        /// <param name="timeTemplate"></param>
        /// <param name="thanksTemplate"></param>
        /// <param name="logTemplate"></param>
        /// <param name="template"></param>
        /// <param name="fromServer"></param>
        /// <returns></returns>
        public int Update(int companyId, int incidentTypeId, string subjectLine, string emailBody, string timeTemplate, string thanksTemplate, string logTemplate, string template, bool fromServer)
        {
            int _return = 0;
            var _emailTemplates =
                from _r in _niEntities.EmailTemplates
                where _r.CompanyId == companyId && _r.IncidentTypeId == incidentTypeId
                select _r;
            if (_emailTemplates.Count() > 0)
            {
                EmailTemplate _emailTemplate = _emailTemplates.First();
                _emailTemplate.CompanyId = companyId;
                _emailTemplate.IncidentTypeId = incidentTypeId;
                _emailTemplate.SubjectLine = subjectLine;
                _emailTemplate.EmailBody = emailBody;
                _emailTemplate.TimeTemplate = timeTemplate;
                _emailTemplate.ThanksTemplate = thanksTemplate;
                _emailTemplate.LogTemplate = logTemplate;
                _emailTemplate.Template = template;
                _emailTemplate.FromServer = fromServer;
                _niEntities.SaveChanges();
                _return = 1;    // one row updated
            }
            return _return;
        }
        //
        // Delete one row from EmailTemplate
        //
        public int Delete(int companyId, int incidentTypeId)
        {
            int _return = 0;
            var _emailTemplates = from _r in _niEntities.EmailTemplates
                                  where _r.CompanyId == companyId && _r.IncidentTypeId == incidentTypeId
                                  select _r;
            if (_emailTemplates.Count() > 0)
            {
                EmailTemplate _emailTemplate = _emailTemplates.First();
                // _niEntities.DeleteObject( _emailTemplate );
                _niEntities.EmailTemplates.Remove(_emailTemplate);
                _niEntities.SaveChanges();
                _return = 1;    // one row updated
            }
            return _return;
        }
        //
        #endregion
        //
    }
    //
}
