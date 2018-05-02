//
// ---------------------------------------------------------------------------
// Brief Description: 
//
//
// Author: Phil Huhn
// Created Date: 2017/11/13
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
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
// CompanyId	int	int
// CompanyName	string	nvarchar
//
// ---------------------------------------------------------------------------
//Company table from the NetworkIncident2 database.
//
namespace WebSrv.Models
{
    public class CompanyData
    {
        #region "Class Properties"
        //
        /// <summary>
        /// For column CompanyId
        /// </summary>
        public int CompanyId { get; set; }
        //
        /// <summary>
        /// For column CompanyName
        /// </summary>
        [Required(ErrorMessage = "'Company Name' is required."),
            MinLength(3, ErrorMessage = "'Company Name' must be at least 3 characters, up to 80 character."),
            MaxLength(80, ErrorMessage = "'Company Name' must be at least 3 characters, up to 80 character.")]
        public string CompanyName { get; set; }
        //
        /// <summary>
        /// Create a 'to string'.
        /// </summary>
        public override string ToString()
        {
            //
            StringBuilder _return = new StringBuilder("record:[");
            _return.AppendFormat("CompanyId: {0}, ", CompanyId.ToString());
            _return.AppendFormat("CompanyName: {0}, ", CompanyName);
            _return.AppendFormat("]");
            return _return.ToString();
        }
        //
        #endregion
    }
    //
    /// <summary>
    /// CRUD for Company table access.
    /// </summary>
    public class CompanyAccess : IDisposable
    {
        //
        // -------------------------------------------------------------------
        //	Constructors
        //		parameter-less
        //
        ApplicationDbContext _niEntities = null;
        bool _external = false;
        //
        #region "Constructors"
        //
        /// <summary>
        /// Create a new object using parameter-less (default) constructor.
        /// </summary>
        public CompanyAccess()
        {
            //
            _niEntities = ApplicationDbContext.Create();
            _external = false;
            //
        }
        //
        /// <summary>
        /// Create a one parameter constructor.
        /// </summary>
        public CompanyAccess(ApplicationDbContext networkIncidentEntities)
        {
            //
            _niEntities = networkIncidentEntities;
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
        // Return an IQueryable of Company
        //
        private IQueryable<CompanyData> ListCompanyQueryable()
        {
            return
                from _r in _niEntities.Companies
                select new CompanyData()
                {
                    CompanyId = _r.CompanyId,
                    CompanyName = _r.CompanyName
                };
        }
        //
        // Return a list with all rows of Company
        //
        public List<CompanyData> List()
        {
            List<CompanyData> _companies = null;
            _companies = ListCompanyQueryable().ToList();
            return _companies;
        }
        //
        // Return one row of Company
        //
        public CompanyData GetByPrimaryKey(int companyId)
        {
            CompanyData _company = null;
            var _companies = ListCompanyQueryable()
                .Where(_r => _r.CompanyId == companyId);
            if (_companies.Count() > 0)
            {
                _company = _companies.First();
            }
            return _company;
        }
        //
        // Insert one row into Company
        //
        public int Insert(int companyId, string companyName, string companyShortName)
        {
            int _return = 0;
            Company _company = new Company();
            _company.CompanyId = companyId;
            _company.CompanyName = companyName;
            _niEntities.Companies.Add(_company);
            _niEntities.SaveChanges();
            _return = 1;	// one row updated
            return _return;
        }
        //
        // Update one row of Company
        //
        public int Update(int companyId, string companyName, string companyShortName)
        {
            int _return = 0;
            var _companies = from _r in _niEntities.Companies
                             where _r.CompanyId == companyId
                             select _r;
            if (_companies.Count() > 0)
            {
                Company _company = _companies.First();
                _company.CompanyName = companyName;
                _niEntities.SaveChanges();
                _return = 1;	// one row updated
            }
            return _return;
        }
        //
        // Delete one row from Company
        //
        public int Delete(int companyId)
        {
            int _return = 0;
            var _companies = from _r in _niEntities.Companies
                             where _r.CompanyId == companyId
                             select _r;
            if (_companies.Count() > 0)
            {
                Company _company = _companies.First();
                // _niEntities.DeleteObject( _company );
                _niEntities.Companies.Remove(_company);
                _niEntities.SaveChanges();
                _return = 1;	// one row updated
            }
            return _return;
        }
        //
        #endregion
        //
    }
    //
}
