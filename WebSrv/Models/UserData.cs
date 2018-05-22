//
// ---------------------------------------------------------------------------
// Brief Description: 
//
//
// Author: Phil Huhn
// Created Date: 2017/11/22
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
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
// Id string nvarchar
// UserName string nvarchar
// CompanyId int int
// FirstName string nvarchar
// LastName string nvarchar
// UserNicName string nvarchar
// Level byte tinyint
// JoinDate DateTime    datetime
// Email string nvarchar
// EmailConfirmed bool bit
// PasswordHash string nvarchar
// SecurityStamp string nvarchar
// PhoneNumber string nvarchar
// PhoneNumberConfirmed bool bit
// TwoFactorEnabled bool bit
// LockoutEndDateUtc DateTime    datetime
// LockoutEnabled bool bit
// AccessFailedCount int int
//
// ---------------------------------------------------------------------------
//Users table from the NetworkIncident2 database.
//
namespace WebSrv.Models
{
	public class UserData
	{
#region "Class Properties"
        //
        /// <summary>
        /// For column Id
        /// </summary>
        public string Id { get; set; }
        //
        /// <summary>
        /// For column UserName
        /// </summary>
        public string UserName { get; set; }
        //
        /// <summary>
        /// For column Email
        /// </summary>
        public string Email { get; set; }
        //
        /// <summary>
        /// For column FirstName
        /// </summary>
        public string FirstName { get; set; }
        //
        /// <summary>
        /// For column LastName
        /// </summary>
        public string LastName { get; set; }
        //
        /// <summary>
        /// For column FullName
        /// </summary>
        public string FullName { get; set; }
        //
        /// <summary>
        /// For column UserNicName
        /// </summary>
        public string UserNicName { get; set; }
        //
        /// <summary>
        /// For column CompanyId
        /// </summary>
        public int CompanyId { get; set; }
        //
        /// <summary>
        /// For column CreateDate
        /// </summary>
        public DateTime CreateDate { get; set; }
        //
        /// <summary>
        /// For column EmailConfirmed
        /// </summary>
        public bool EmailConfirmed { get; set; }
        //
        /// <summary>
        /// For column PhoneNumber
        /// </summary>
        public string PhoneNumber { get; set; }
        //
        /// <summary>
        /// For column PhoneNumberConfirmed
        /// </summary>
        public bool PhoneNumberConfirmed { get; set; }
        //
        /// <summary>
        /// For column TwoFactorEnabled
        /// </summary>
        public bool TwoFactorEnabled { get; set; }
        //
        /// <summary>
        /// For column LockoutEndDateUtc
        /// </summary>
        public DateTime? LockoutEndDateUtc { get; set; }
        //
        /// <summary>
        /// For column LockoutEnabled
        /// </summary>
        public bool LockoutEnabled { get; set; }
        //
        /// <summary>
        /// For column AccessFailedCount
        /// </summary>
        public int AccessFailedCount { get; set; }
        //
        /// <summary>
        /// Create a 'to string'.
        /// </summary>
        public override string ToString()
        {
            //
            StringBuilder _return = new StringBuilder("record:[");
            _return.AppendFormat("Id: {0}, ", Id);
            _return.AppendFormat("UserName: {0}, ", UserName);
            _return.AppendFormat("Email: {0}, ", Email);
            _return.AppendFormat("FirstName: {0}, ", FirstName);
            _return.AppendFormat("LastName: {0}, ", LastName);
            _return.AppendFormat("FullName: {0}, ", FullName);
            _return.AppendFormat("UserNicName: {0}, ", UserNicName);
            _return.AppendFormat("CompanyId: {0}, ", CompanyId.ToString());
            _return.AppendFormat("CreateDate: {0}, ", CreateDate.ToString());
            _return.AppendFormat("EmailConfirmed: {0}, ", EmailConfirmed.ToString());
            _return.AppendFormat("PhoneNumber: {0}, ", PhoneNumber);
            _return.AppendFormat("PhoneNumberConfirmed: {0}, ", PhoneNumberConfirmed.ToString());
            _return.AppendFormat("TwoFactorEnabled: {0}, ", TwoFactorEnabled.ToString());
            if (LockoutEndDateUtc.HasValue)
                _return.AppendFormat("LockoutEndDateUtc: {0}, ", LockoutEndDateUtc.ToString());
            else
                _return.AppendFormat("/LockoutEndDateUtc/, ");
            _return.AppendFormat("LockoutEnabled: {0}, ", LockoutEnabled.ToString());
            _return.AppendFormat("AccessFailedCount: {0}]", AccessFailedCount.ToString());
            return _return.ToString();
        }
        //
#endregion
    }
    //
    public class UserServerData
    {
        #region "UserServer Class Properties"
        //
        /// <summary>
        /// For column Id
        /// </summary>
        public string Id { get; set; }
        //
        /// <summary>
        /// For column UserName
        /// </summary>
        public string UserName { get; set; }
        //
        /// <summary>
        /// For column FirstName
        /// </summary>
        public string FirstName { get; set; }
        //
        /// <summary>
        /// For column LastName
        /// </summary>
        public string LastName { get; set; }
        //
        /// <summary>
        /// For column FullName
        /// </summary>
        public string FullName { get; set; }
        //
        /// <summary>
        /// For column UserNicName
        /// </summary>
        public string UserNicName { get; set; }
        //
        /// <summary>
        /// For column Email
        /// </summary>
        public string Email { get; set; }
        //
        /// <summary>
        /// For column EmailConfirmed
        /// </summary>
        public bool EmailConfirmed { get; set; }
        //
        /// <summary>
        /// For column PhoneNumber
        /// </summary>
        public string PhoneNumber { get; set; }
        //
        /// <summary>
        /// For column PhoneNumberConfirmed
        /// </summary>
        public bool PhoneNumberConfirmed { get; set; }
        //
        /// <summary>
        /// For column CompanyId
        /// </summary>
        public int CompanyId { get; set; }
        //
        /// <summary>
        /// For collection of ServerShortName
        /// </summary>
        public SelectItem[] ServerShortNames { get; set; }
        //
        /// <summary>
        /// For collection of ServerShortName
        /// </summary>
        public string ServerShortName { get; set; }
        //
        /// <summary>
        /// The currently selected server
        /// </summary>
        public ServerData Server { get; set; }
        //
        /// <summary>
        /// For collection of roles
        /// </summary>
        public string[] Roles { get; set; }
        //
        /// <summary>
        /// Create a 'to string'.
        /// </summary>
        public override string ToString()
        {
            //
            StringBuilder _return = new StringBuilder("record:[");
            _return.AppendFormat("Id: {0}, ", Id);
            _return.AppendFormat("UserName: {0}, ", UserName);
            _return.AppendFormat("Email: {0}, ", Email);
            _return.AppendFormat("FirstName: {0}, ", FirstName);
            _return.AppendFormat("LastName: {0}, ", LastName);
            _return.AppendFormat("FullName: {0}, ", FullName);
            _return.AppendFormat("UserNicName: {0}, ", UserNicName);
            _return.AppendFormat("CompanyId: {0}, ", CompanyId.ToString());
            _return.AppendFormat("EmailConfirmed: {0}, ", EmailConfirmed.ToString());
            _return.AppendFormat("PhoneNumber: {0}, ", PhoneNumber);
            _return.AppendFormat("PhoneNumberConfirmed: {0}, ", PhoneNumberConfirmed.ToString());
            _return.AppendFormat("ServerShortName: {0}, ", ServerShortName);
            return _return.ToString();
            //
        }
        //
        #endregion
    }
    //
    /// <summary>
    /// CRUD for Users table access.
    /// </summary>
    public class UserAccess : IDisposable
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
		public UserAccess( )
		{
			//
			_niEntities = ApplicationDbContext.Create( );
			_external = false;
			//
		}
		//
		/// <summary>
		/// Create a one parameter constructor.
		/// </summary>
		public UserAccess(ApplicationDbContext niEntities)
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
			if (_external == false) {
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
        //
        #region "Public Access Methods"
        //
        // public string Id { get; set; }
        // public string UserName { get; set; }
        // public string FirstName { get; set; }
        // public string LastName { get; set; }
        // public string FullName { get; set; }
        // public string UserNicName { get; set; }
        // public string Email { get; set; }
        // public bool EmailConfirmed { get; set; }
        // public string PhoneNumber { get; set; }
        // public bool PhoneNumberConfirmed { get; set; }
        // public int CompanyId { get; set; }
        // public string ServerShortName { get; set; }
        // public string[] ServerShortNames { get; set; }
        // public ServerData Server { get; set; }
        //
        // Return a list with all rows of Users
        //
        public List<UserServerData> List()
		{
            return _niEntities.Users
                .AsEnumerable<ApplicationUser>()
                .Select(_u => _u.ToUserServerData()).ToList();
        }
        //
        //
        /// <summary>
        /// Return one user translated to DTO
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public UserServerData GetByUserName(string userName)
        {
            return GetUserServerByUserName( userName, "" );
        }
        //
        /// <summary>
        /// Return one user translated to DTO,
        /// including the server DTO if found.
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="serverShortName"></param>
        /// <returns></returns>
        public UserServerData GetUserServerByUserName(string userName, string serverShortName)
        {
            UserServerData _user = null;
            if (serverShortName == null)
                serverShortName = "";
            var _usersEntity = _niEntities.Users.
                FirstOrDefault( _r => _r.UserName == userName );
            if ( _usersEntity != null )
            {
                _user = _usersEntity.ToUserServerData();
                if ( serverShortName != "" )
                {
                    serverShortName = serverShortName.ToLower();
                    ApplicationServer _srv =
                        _usersEntity.Servers.FirstOrDefault( _s => _s.ServerShortName.ToLower() == serverShortName );
                    if ( _srv != null )
                    {
                        _user.Server = _srv.ToServerData( );
                        _user.ServerShortName = serverShortName;
                    }
                }
            }
            return _user;
        }
		//
		// Update one row of Users
		//
        public int Update(string id, string userName, int companyId, string firstName, string lastName, string userNicName, string email, bool emailConfirmed, string phoneNumber, bool phoneNumberConfirmed, bool twoFactorEnabled, DateTime lockoutEndDateUtc, bool lockoutEnabled, int accessFailedCount)
        {
			int _return = 0;
			var _users = from _r in _niEntities.Users
				where _r.Id == id
				select _r;
			if ( _users.Count( ) > 0 )
			{
                ApplicationUser _user	= _users.First( );
                _user.CompanyId = companyId;
                _user.FirstName = firstName;
                _user.LastName = lastName;
                _user.UserName = userName;
                _user.UserNicName = userNicName;
                _user.Email = email;
                _user.EmailConfirmed = emailConfirmed;
                _user.PhoneNumber = phoneNumber;
                _user.PhoneNumberConfirmed = phoneNumberConfirmed;
                _user.TwoFactorEnabled = twoFactorEnabled;
                _user.LockoutEndDateUtc = lockoutEndDateUtc;
                _user.LockoutEnabled = lockoutEnabled;
                _user.AccessFailedCount = accessFailedCount;
                _niEntities.SaveChanges( );
				_return	= 1;	// one row updated
			}
			return _return;
		}
		//
		// Delete one row from Users
		//
		public int Delete(string id)
		{
			int _return = 0;
			var _users = from _r in _niEntities.Users
				where _r.Id == id
				select _r;
			if ( _users.Count( ) > 0 )
			{
				ApplicationUser _user	= _users.First( );
				_niEntities.Users.Remove( _user );
				_niEntities.SaveChanges( );
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
