//
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
//
namespace NSG.Identity.Incidents
{
    public class ApplicationServerManager: IDisposable
    {
        static ServerStore _serverStore = null;
        public ServerStore Store { set; get; }
        public ApplicationServerManager(ServerStore serverStore)
        {
            Store = serverStore;
            _serverStore = serverStore;
        }

        public static ApplicationServerManager Create(IdentityFactoryOptions<ApplicationServerManager> options, IOwinContext context)
        {
            _serverStore = new ServerStore(context.Get<ApplicationDbContext>());
            var appServerManager = new ApplicationServerManager(_serverStore);

            return appServerManager;
        }

        // Asynchronously creates a server.
        public Task CreateAsync(ApplicationServer server)
        {
            return _serverStore.CreateAsync( server );
        }
        public void Create(ApplicationServer server)
        {
            _serverStore.Create(server);
        }
        // IQueryable
        public IQueryable<ApplicationServer> Servers
        {
            get { return _serverStore.Servers; }
        }
        // Asynchronously deletes a server.
        public Task DeleteAsync(ApplicationServer server)
        {
            return _serverStore.DeleteAsync( server );
        }
        public void Delete(ApplicationServer server)
        {
            _serverStore.Delete(server);
        }
        // Asynchronously finds a server using the specified identifier.
        public Task<ApplicationServer> FindByIdAsync(int serverId)
        {
            return _serverStore.FindByIdAsync( serverId );
        }
        public ApplicationServer FindById(int serverId)
        {
            return _serverStore.FindById(serverId);
        }
        // Asynchronously finds a server by name.
        public Task<ApplicationServer> FindByNameAsync(string serverName)
        {
            return _serverStore.FindByNameAsync(serverName);
        }
        public ApplicationServer FindByName(string serverName)
        {
            return _serverStore.FindByName(serverName);
        }
        //
        public Task AddToServerAsync(ApplicationUser user, string serverShortName)
        {
            _serverStore.AddToServerAsync(user, serverShortName);
            return Task.FromResult<object>(null);
        }
        public void AddToServer(ApplicationUser user, string serverShortName)
        {
            _serverStore.AddToServer(user, serverShortName);
        }
        public Task UpdateAsync(ApplicationServer server)
        {
            return _serverStore.UpdateAsync(server);
        }
        // non-async version
        public void Update(ApplicationServer server)
        {
            _serverStore.Update(server);
        }
        //
        public Task RemoveFromServerAsync(ApplicationUser user, string serverShortName)
        {
            _serverStore.RemoveFromServerAsync(user, serverShortName);
            return Task.FromResult<object>(null);
        }
        public void RemoveFromServer(ApplicationUser user, string serverShortName)
        {
            _serverStore.RemoveFromServer(user, serverShortName);
        }
        //
        //
        //  Dispose
        //
        public void Dispose()
        {
            _serverStore.Dispose();
        }
        //
        //public void Dispose(bool disposing)  { }
    }
}
//
