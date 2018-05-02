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
    public class ServerStore_Old : IDisposable
    {
        //
        private readonly string _codeName = "ServerStore";
        private readonly ApplicationDbContext _dbContext;
        //
        public ServerStore_Old(ApplicationDbContext dbContext)
        {
            this._dbContext = dbContext;
        }
        public ApplicationDbContext DbContext
        {
            get { return this._dbContext; }
        }
        //
        // IQueryable
        //
        public IQueryable<ApplicationServer> Servers
        {
            get { return this._dbContext.Servers; }
        }
        //
        // TResult int
        //
        public Task CreateAsync(ApplicationServer Server)
        {
            if (Server == null)
            {
                throw new ArgumentNullException("Server");
            }

            this._dbContext.Servers.Add(Server);
            return this._dbContext.SaveChangesAsync();
        }
        // non-async version
        public int Create(ApplicationServer Server)
        {
            if (Server == null)
            {
                throw new ArgumentNullException("Server");
            }

            this._dbContext.Servers.Add(Server);
            return this._dbContext.SaveChanges();
        }
        //
        // TResult int
        //
        public Task DeleteAsync(ApplicationServer server)
        {
            if (server == null)
            {
                throw new ArgumentNullException("Server");
            }
            //
            this._dbContext.Servers.Remove(server);
            return this._dbContext.SaveChangesAsync();
        }
        // non-async version
        public int Delete(ApplicationServer server)
        {
            if (server == null)
            {
                throw new ArgumentNullException("Server");
            }
            //
            this._dbContext.Servers.Remove(server);
            return this._dbContext.SaveChanges();
        }
        // find
        public Task<ApplicationServer> FindByIdAsync(int ServerId)
        {
            return this._dbContext.Servers.FindAsync(ServerId);
        }
        // non-async version
        public ApplicationServer FindById(int ServerId)
        {
            return this._dbContext.Servers.Find(ServerId);
        }
        //
        public Task<ApplicationServer> FindByNameAsync(string ServerName)
        {
            return this._dbContext.Servers.FirstOrDefaultAsync(r => r.ServerShortName == ServerName);
        }
        // non-async version
        public ApplicationServer FindByName(string ServerName)
        {
            return this._dbContext.Servers.FirstOrDefault(r => r.ServerShortName == ServerName);
        }
        //
        public Task UpdateAsync(ApplicationServer Server)
        {
            if (Server == null)
            {
                throw new ArgumentNullException("Server");
            }
            //
            this._dbContext.Entry(Server).State = EntityState.Modified;
            return this._dbContext.SaveChangesAsync();
        }
        // non-async version
        public int Update(ApplicationServer Server)
        {
            if (Server == null)
            {
                throw new ArgumentNullException("Server");
            }
            //
            this._dbContext.Entry(Server).State = EntityState.Modified;
            return this._dbContext.SaveChanges();
        }
        //
        public Task<IdentityResult> AddToServerAsync(string userId, string serverShortName)
        {
            AddServerToUser(userId, serverShortName);
            this._dbContext.SaveChangesAsync();
            return Task<IdentityResult>.Factory.StartNew(() => {
                return IdentityResult.Success;
            });
        }
        // non-async version
        public int AddToServer(string userId, string serverShortName)
        {
            AddServerToUser(userId, serverShortName);
            return this._dbContext.SaveChanges();
        }
        // private
        private void AddServerToUser(string userId, string serverShortName)
        {
            // Make sure the server exists
            ApplicationServer _server = _dbContext.Servers.FirstOrDefault(r => r.ServerShortName == serverShortName);
            if (_server == null)
            {
                // "{0} - 'server/device' not found: {1}"
                throw new ArgumentNullException(string.Format(
                    NSG.Identity.Constants.ServerNotFoundException, _codeName, serverShortName));
            }
            //
            ApplicationUser _user = _dbContext.Users.FirstOrDefault(r => r.Id == userId);
            if (_user == null)
            {
                // "{0} - 'user' not found: {1}"
                throw new ArgumentNullException(string.Format(
                    NSG.Identity.Constants.UserNotFoundException, _codeName, userId));
            }
            // Make sure the user doesn't already have this server
            if (_user.Servers.FirstOrDefault(r => r.ServerShortName == serverShortName) != null)
            {
                // "{0} - user: {1}, 'server/device' already assigned: {2}"
                throw new ArgumentNullException(string.Format(
                    NSG.Identity.Constants.ServerAlreadyAssignedException, _codeName, userId, serverShortName));
            }
            _user.Servers.Add(_server);
            this._dbContext.Entry(_user).State = EntityState.Modified;
        }
        // async delete server from user
        public Task<IdentityResult> DeleteFromServerAsync(string userId, string serverShortName)
        {
            DeleteServerFromUser(userId, serverShortName);
            this._dbContext.SaveChangesAsync();
            return Task<IdentityResult>.Factory.StartNew(() => {
                return IdentityResult.Success;
            });
        }
        // non-async delete server from user
        public int DeleteFromServers(string userId, string serverShortName)
        {
            DeleteServerFromUser(userId, serverShortName);
            return this._dbContext.SaveChanges();
        }
        // private delete server from user
        private void DeleteServerFromUser(string userId, string serverShortName)
        {
            //
            ApplicationUser _user = _dbContext.Users.FirstOrDefault(r => r.Id == userId);
            if (_user == null)
            {
                // "{0} - 'user' not found: {1}"
                throw new ArgumentNullException(string.Format(
                    NSG.Identity.Constants.UserNotFoundException, _codeName, userId));
            }
            ApplicationServer _server = _user.Servers.FirstOrDefault(r => r.ServerShortName == serverShortName);
            if (_server == null)
            {
                // "{0} - user: {1}, server: {2} not found."
                throw new ArgumentNullException(string.Format(
                    NSG.Identity.Constants.UserServerNotFoundException, _codeName, userId, serverShortName));
            }
            _user.Servers.Remove(_server);
            this._dbContext.Entry(_user).State = EntityState.Modified;
        }
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
    }
}
