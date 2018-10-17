//
using System;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;
using System.Data.Common; // DbConnection for in memory
//
using NSG.Identity.Incidents;
using NSG.Library.Logger;
using System.Data.Entity.ModelConfiguration.Conventions;
//
namespace NSG.Identity
{
    //
    // Must be expressed in terms of our custom types:
    public partial class ApplicationDbContext
        : IdentityDbContext<ApplicationUser, ApplicationRole,
            string, ApplicationUserLogin, ApplicationUserRole, ApplicationUserClaim>
    {
        public ApplicationDbContext()
            : base(Constants.AspNetIdentityConnectionString)
        {
        }
        public ApplicationDbContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {
        }
        public ApplicationDbContext(DbConnection connection)
            : base(connection, true)
        {
        }
        //
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
        //
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();
            modelBuilder.Entity<ApplicationUser>().HasRequired(u => u.Company)
                .WithMany(c => c.Users).HasForeignKey(u => u.CompanyId);
            modelBuilder.Entity<ApplicationUser>().HasRequired(u => u.Company)
                .WithMany(c => c.Users).HasForeignKey(u => u.CompanyId).WillCascadeOnDelete(false);
            modelBuilder.Entity<LogData>().ToTable("Logs");
        }
        // support
        public virtual DbSet<LogData> Logs { get; set; }
        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<ApplicationServer> Servers { get; set; }
        // types
        public virtual DbSet<IncidentType> IncidentTypes { get; set; }
        public virtual DbSet<NIC> NICs { get; set; }
        public virtual DbSet<NoteType> NoteTypes { get; set; }
        public virtual DbSet<EmailTemplate> EmailTemplates { get; set; }
        // incidents
        public virtual DbSet<Incident> Incidents { get; set; }
        public virtual DbSet<NetworkLog> NetworkLogs { get; set; }
        public virtual DbSet<IncidentNote> IncidentNotes { get; set; }
        //
    }
    //
}
//
