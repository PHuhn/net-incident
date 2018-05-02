using System;
using System.Text;
using Effort;
//
using NSG.Identity;
using WebSrv.Models;
//
namespace WebSrv_Tests
{
    public static class Effort_Helper
    {
        //
        private static string _connectionStringKey = "NetworkIncidentConnection";
        //
        public static string CSV_FullPath =
            @"C:\Dat\Nsg\L\Web\Ng\NetIncidents3\WebSrv_Tests\App_Data\Effort";
        //
        public static string GetConnectionString()
        {
            return System.Configuration.ConfigurationManager.ConnectionStrings[_connectionStringKey]
                .ConnectionString;
        }
        //
        public static ApplicationDbContext GetEffortEntity( string connectionString, string fullPath )
        {
            Effort.DataLoaders.IDataLoader _loader = new Effort.DataLoaders.CsvDataLoader(fullPath);
            // The 'data source' keyword is not supported.
            System.Data.Common.DbConnection _connection = 
                Effort.DbConnectionFactory.CreateTransient( _loader );
            // System.Data.Entity.Core.Objects.ObjectContext
            return new ApplicationDbContext( _connection );
        }
    }
}
