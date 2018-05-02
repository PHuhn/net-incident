using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
//
using NSG.Identity;
//
namespace NSG.Identity.Incidents
{
    /// <summary>
    /// Class that implements the key ASP.NET Identity user store iterfaces
    /// </summary>
    public class ServerStore : IDisposable
    {
        //
        private readonly string _codeName = "ServerStore";
        private readonly ApplicationDbContext _dbContext;
        // strings
        string _invalidUserArgument = "Argument cannot be null: user.";
        string _invalidServerArgument = "Argument cannot be null: server.";
        string _invalidShortNameArgument = "Argument cannot be null or empty: shortName.";
        string _invalidServerInUse = "{0}, Server shortName: {1} by incident {2}.";
        //
        public ServerStore(ApplicationDbContext dbContext)
        {
            this._dbContext = dbContext;
        }
        public ApplicationDbContext DbContext
        {
            get { return this._dbContext; }
        }
        //
        //  Server CRUD
        //      IQueryable<ApplicationServer> Servers
        //      Task CreateAsync(ApplicationServer server)
        //      void Create(ApplicationServer server)
        //      Task UpdateAsync(ApplicationServer server)
        //      void Update(ApplicationServer server)
        //      Task DeleteAsync(ApplicationServer server)
        //      void Delete(ApplicationServer server)
        //
        #region "Server CRUD"
        //
        //
        /// <summary>
        /// IQueryable of ApplicationServer's
        /// </summary>
        public IQueryable<ApplicationServer> Servers
        {
            get { return this._dbContext.Servers; }
        }
        //
        /// <summary>
        /// Insert a new server to ApplicationServer
        /// </summary>
        /// <param name="server"></param>
        /// <returns>nothing</returns>
        public Task CreateAsync(ApplicationServer server)
        {
            Create( server );
            return Task.FromResult<object>(null);
        }
        //
        /// <summary>
        /// Insert a new server to ApplicationServer
        /// </summary>
        /// <param name="server">an ApplicationServer</param>
        /// <returns>nothing</returns>
        public void Create(ApplicationServer server)
        {
            if (server == null)
            {
                throw new ArgumentNullException( _invalidServerArgument );
            }
            //
            this._dbContext.Servers.Add(server);
            this._dbContext.SaveChanges();
        }
        //
        /// <summary>
        /// Update a server
        /// </summary>
        /// <param name="server">an ApplicationServer</param>
        /// <returns>nothing</returns>
        public Task UpdateAsync(ApplicationServer server)
        {
            Update(server);
            return Task.FromResult<object>(null);
        }
        //
        /// <summary>
        /// Update a server
        /// </summary>
        /// <param name="server">an ApplicationServer</param>
        /// <returns>nothing</returns>
        public void Update(ApplicationServer server)
        {
            var _server = this._dbContext.Servers.FirstOrDefault( s => s.ServerId == server.ServerId );
            if ( _server != null )
            {
                //
                if (_server.CompanyId != server.CompanyId)
                    _server.CompanyId = server.CompanyId;
                if (_server.ServerShortName != server.ServerShortName)
                    _server.ServerShortName = server.ServerShortName;
                if (_server.ServerName != server.ServerName)
                    _server.ServerName = server.ServerName;
                if (_server.WebSite != server.WebSite)
                    _server.WebSite = server.WebSite;
                if (_server.ServerDescription != server.ServerDescription)
                    _server.ServerDescription = server.ServerDescription;
                if (_server.ServerLocation != server.ServerLocation)
                    _server.ServerLocation = server.ServerLocation;
                if (_server.FromName != server.FromName)
                    _server.FromName = server.FromName;
                if (_server.FromNicName != server.FromNicName)
                    _server.FromNicName = server.FromNicName;
                if (_server.FromEmailAddress != server.FromEmailAddress)
                    _server.FromEmailAddress = server.FromEmailAddress;
                if (_server.TimeZone != server.TimeZone)
                    _server.TimeZone = server.TimeZone;
                if (_server.DST != server.DST)
                    _server.DST = server.DST;
                if (_server.TimeZone_DST != server.TimeZone_DST)
                    _server.TimeZone_DST = server.TimeZone_DST;
                if (_server.DST_Start != server.DST_Start)
                    _server.DST_Start = server.DST_Start;
                if (_server.DST_End != server.DST_End)
                    _server.DST_End = server.DST_End;
                //
                this._dbContext.SaveChanges();
            }
        }
        //
        /// <summary>
        /// Delete a server from ApplicationServer
        /// </summary>
        /// <param name="server">an ApplicationServer</param>
        /// <returns>nothing</returns>
        public Task DeleteAsync(ApplicationServer server)
        {
            Delete(server);
            return Task.FromResult<object>(null);
        }
        //
        /// <summary>
        /// Delete a server from ApplicationServer
        /// </summary>
        /// <param name="server">an ApplicationServer</param>
        /// <returns>nothing</returns>
        public void Delete(ApplicationServer server)
        {
            if (server == null)
            {
                throw new ArgumentNullException( _invalidServerArgument );
            }
            ApplicationServer _server = FindById( server.ServerId );
            if( _server != null )
            {
                //
                var netlogs = this._dbContext.NetworkLogs.Where(_nl => _nl.ServerId == server.ServerId);
                foreach (NetworkLog _l in netlogs)
                {
                    //         string _invalidServerInUse = "{0}, Server shortName: {1} in use by incident {2}.";
                    if ( _l.IncidentId > 0 )
                        throw new ArgumentNullException(
                            string.Format(_invalidServerInUse, _codeName, 
                            _server.ServerShortName, _l.IncidentId));
                    //
                    this._dbContext.NetworkLogs.Remove(_l);
                }
                this._dbContext.Servers.Remove(_server);
                this._dbContext.SaveChanges();
            }
            //
        }
        //
        #endregion // Server CRUD
        //
        //  Find-By:
        //      Task<ApplicationServer> FindByIdAsync(int ServerId)
        //      ApplicationServer FindById(int ServerId)
        //      Task<ApplicationServer> FindByNameAsync(string shortName)
        //      ApplicationServer FindByName(string shortName)
        //
        #region "Find-By"
        //
        /// <summary>
        /// Returns an ApplicationServer instance based on a serverId query
        /// </summary>
        /// <param name="serverId"></param>
        /// <returns>an ApplicationServer</returns>
        public Task<ApplicationServer> FindByIdAsync(int serverId)
        {
            return Task.FromResult<ApplicationServer>( this.FindById( serverId ) );
        }
        //
        /// <summary>
        /// Returns an ApplicationServer instance based on a serverId query
        /// </summary>
        /// <param name="serverId"></param>
        /// <returns>an ApplicationServer</returns>
        public ApplicationServer FindById(int serverId)
        {
            return this._dbContext.Servers.Find(serverId);
        }
        //
        /// <summary>
        /// Returns an ApplicationServer instance based on a server short name query
        /// </summary>
        /// <param name="shortName">Server short name</param>
        /// <returns>an ApplicationServer</returns>
        public Task<ApplicationServer> FindByNameAsync(string shortName)
        {
            return Task.FromResult<ApplicationServer>( this.FindByName( shortName ) );
        }
        //
        /// <summary>
        /// Returns an ApplicationServer instance based on a server short name query
        /// </summary>
        /// <param name="shortName">Server short name</param>
        /// <returns>an ApplicationServer</returns>
        public ApplicationServer FindByName(string shortName)
        {
            return this._dbContext.Servers.FirstOrDefault(r => r.ServerShortName.ToLower() == shortName.ToLower());
        }
        //
        #endregion // FindBy
        //
        //      Task AddToServerAsync(ApplicationUser user, string shortName)
        //      void AddToServer(ApplicationUser user, string shortName)
        //      Task<List<string>> GetServersAsync(ApplicationUser user)
        //      Task<bool> IsInServerAsync(ApplicationUser user, string server)
        //      Task RemoveFromServerAsync(ApplicationUser user, string server)
        //
        #region "User-Server"
        //
        /// <summary>
        /// Inserts an entry in the UserServers table
        /// </summary>
        /// <param name="user">User to have server added</param>
        /// <param name="shortName">Name of the server to be added to user</param>
        /// <returns></returns>
        public Task AddToServerAsync(ApplicationUser user, string shortName)
        {
            AddToServer( user, shortName );
            return Task.FromResult<object>(null);
        }
        //
        /// <summary>
        /// Inserts an entry in the UserServers table
        /// </summary>
        /// <param name="user">User to have server added</param>
        /// <param name="shortName">Name of the server to be added to user</param>
        /// <returns></returns>
        public void AddToServer(ApplicationUser user, string shortName)
        {
            if (user == null)
            {
                throw new ArgumentNullException(_invalidUserArgument);
            }
            if (string.IsNullOrEmpty(shortName))
            {
                throw new ArgumentException(_invalidShortNameArgument);
            }
            //
            if (user.Servers.Where(_s => _s.ServerShortName.Contains(shortName)).Select(_s => _s.ServerId).Count() == 0)
            {
                //
                ApplicationServer _server = FindByName(shortName);
                if (_server != null)
                {
                    user.Servers.Add(_server);
                    this._dbContext.SaveChanges();
                }
                //
            }
        }
        //
        /// <summary>
        /// Returns the servers for a given ApplicationUser
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<List<string>> GetServersAsync(ApplicationUser user)
        {
            return Task.FromResult<List<string>>(GetServers(user));
        }
        //
        /// <summary>
        /// Returns the servers for a given ApplicationUser
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public List<string> GetServers(ApplicationUser user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(_invalidUserArgument);
            }
            //
            List<string> servers = user.Servers.Select(_s => _s.ServerShortName).ToList();
            //
            if (servers != null)
            {
                return servers;
            }
            //
            return null;
        }
        //
        /// <summary>
        /// Verifies if a user is in a server
        /// </summary>
        /// <param name="user"></param>
        /// <param name="server"></param>
        /// <returns></returns>
        public Task<bool> IsInServerAsync(ApplicationUser user, string shortName)
        {
            return Task.FromResult<bool>( IsInServer( user, shortName ) );
        }
        //
        /// <summary>
        /// Verifies if a user is in a server
        /// </summary>
        /// <param name="user"></param>
        /// <param name="server"></param>
        /// <returns></returns>
        public bool IsInServer(ApplicationUser user, string shortName)
        {
            if (user == null)
            {
                throw new ArgumentNullException(_invalidUserArgument);
            }
            if (string.IsNullOrEmpty(shortName))
            {
                throw new ArgumentException(_invalidShortNameArgument);
            }
            //
            List<string> servers = user.Servers.Select(_s => _s.ServerShortName).ToList();
            //
            if (servers != null && servers.Contains(shortName))
            {
                return true;
            }
            //
            return false;
        }
        //
        /// <summary>
        /// Removes a user from a server
        /// </summary>
        /// <param name="user"></param>
        /// <param name="shortName">server short name</param>
        /// <returns></returns>
        public Task RemoveFromServerAsync(ApplicationUser user, string shortName)
        {
            RemoveFromServer( user, shortName );
            return Task.FromResult<object>(null);
        }
        //
        /// <summary>
        /// Removes a user from a server
        /// </summary>
        /// <param name="user"></param>
        /// <param name="shortName">server short name</param>
        /// <returns></returns>
        public void RemoveFromServer(ApplicationUser user, string shortName)
        {
            if (user == null)
            {
                throw new ArgumentNullException(_invalidUserArgument);
            }
            if (string.IsNullOrEmpty(shortName))
            {
                throw new ArgumentException(_invalidShortNameArgument);
            }
            //
            if (user.Servers.Where(_s => _s.ServerShortName.Contains(shortName)).Select(_s => _s.ServerId).Count() > 0)
            {
                //
                ApplicationServer _server = FindByName(shortName);
                if (_server != null)
                {
                    user.Servers.Remove(_server);
                    this._dbContext.SaveChanges();
                }
                //
            }
        }
        //
        #endregion // User-Server
        //
        // IDisposable
        //
        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }
        //
        protected virtual void Dispose(bool disposing)
        {
            if (disposing && this._dbContext != null)
            {
                this._dbContext.Dispose();
            }
        }
        //
    }
}
