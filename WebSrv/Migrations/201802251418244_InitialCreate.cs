namespace WebSrv.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Companies",
                c => new
                    {
                        CompanyId = c.Int(nullable: false, identity: true),
                        CompanyShortName = c.String(nullable: false, maxLength: 12),
                        CompanyName = c.String(nullable: false, maxLength: 80),
                    })
                    .PrimaryKey(t => t.CompanyId);
                CreateIndex("dbo.Companies", "CompanyShortName", unique: true, name: "Idx_Companies_ShortName");

            CreateTable(
                "dbo.Servers",
                c => new
                    {
                        ServerId = c.Int(nullable: false, identity: true),
                        CompanyId = c.Int(nullable: false),
                        ServerShortName = c.String(nullable: false, maxLength: 12),
                        ServerName = c.String(nullable: false, maxLength: 80),
                        ServerDescription = c.String(nullable: false, maxLength: 255),
                        WebSite = c.String(nullable: false, maxLength: 255),
                        ServerLocation = c.String(nullable: false, maxLength: 255),
                        FromName = c.String(nullable: false, maxLength: 255),
                        FromNicName = c.String(nullable: false, maxLength: 16),
                        FromEmailAddress = c.String(nullable: false, maxLength: 255),
                        TimeZone = c.String(nullable: false, maxLength: 16),
                        DST = c.Boolean(nullable: false),
                        TimeZone_DST = c.String(maxLength: 16),
                        DST_Start = c.DateTime(),
                        DST_End = c.DateTime(),
                    })
                .PrimaryKey(t => t.ServerId)
                .ForeignKey("dbo.Companies", t => t.CompanyId, cascadeDelete: true)
                .Index(t => t.CompanyId)
                .Index(t => t.ServerShortName, unique: true, name: "Idx_AspNetServers_ShortName");
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        FirstName = c.String(nullable: false, maxLength: 100),
                        LastName = c.String(nullable: false, maxLength: 100),
                        FullName = c.String(nullable: false, maxLength: 100),
                        UserNicName = c.String(nullable: false, maxLength: 16),
                        CompanyId = c.Int(nullable: false),
                        CreateDate = c.DateTime(nullable: false),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Companies", t => t.CompanyId)
                .Index(t => t.CompanyId)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.IncidentNote",
                c => new
                    {
                        IncidentNoteId = c.Long(nullable: false, identity: true),
                        NoteTypeId = c.Int(nullable: false),
                        Note = c.String(nullable: false),
                        CreatedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.IncidentNoteId)
                .ForeignKey("dbo.NoteType", t => t.NoteTypeId, cascadeDelete: true)
                .Index(t => t.NoteTypeId);
            
            CreateTable(
                "dbo.Incident",
                c => new
                    {
                        IncidentId = c.Long(nullable: false, identity: true),
                        ServerId = c.Int(nullable: false),
                        IPAddress = c.String(nullable: false, maxLength: 50),
                        NIC_Id = c.String(nullable: false, maxLength: 16),
                        NetworkName = c.String(maxLength: 255),
                        AbuseEmailAddress = c.String(maxLength: 255),
                        ISPTicketNumber = c.String(maxLength: 50),
                        Mailed = c.Boolean(nullable: false),
                        Closed = c.Boolean(nullable: false),
                        Special = c.Boolean(nullable: false),
                        Notes = c.String(),
                        CreatedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.IncidentId)
                .ForeignKey("dbo.NIC", t => t.NIC_Id, cascadeDelete: true)
                .ForeignKey("dbo.Servers", t => t.ServerId, cascadeDelete: true)
                .Index(t => t.ServerId)
                .Index(t => t.NIC_Id);
            
            CreateTable(
                "dbo.NIC",
                c => new
                    {
                        NIC_Id = c.String(nullable: false, maxLength: 16),
                        NICDescription = c.String(nullable: false, maxLength: 255),
                        NICAbuseEmailAddress = c.String(maxLength: 50),
                        NICRestService = c.String(maxLength: 255),
                        NICWebSite = c.String(maxLength: 255),
                    })
                .PrimaryKey(t => t.NIC_Id);
            
            CreateTable(
                "dbo.NoteType",
                c => new
                    {
                        NoteTypeId = c.Int(nullable: false, identity: true),
                        NoteTypeDesc = c.String(nullable: false, maxLength: 50),
                        NoteTypeShortDesc = c.String(nullable: false, maxLength: 8),
                    })
                .PrimaryKey(t => t.NoteTypeId);
            
            CreateTable(
                "dbo.IncidentType",
                c => new
                    {
                        IncidentTypeId = c.Int(nullable: false, identity: true),
                        IncidentTypeShortDesc = c.String(nullable: false, maxLength: 8),
                        IncidentTypeDesc = c.String(nullable: false, maxLength: 50),
                        IncidentTypeFromServer = c.Boolean(nullable: false),
                        IncidentTypeSubjectLine = c.String(nullable: false),
                        IncidentTypeEmailTemplate = c.String(nullable: false),
                        IncidentTypeTimeTemplate = c.String(nullable: false),
                        IncidentTypeThanksTemplate = c.String(nullable: false),
                        IncidentTypeLogTemplate = c.String(nullable: false),
                        IncidentTypeTemplate = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.IncidentTypeId);
            
            CreateTable(
                "dbo.NetworkLog",
                c => new
                    {
                        NetworkLogId = c.Long(nullable: false, identity: true),
                        ServerId = c.Int(nullable: false),
                        IncidentId = c.Long(),
                        IPAddress = c.String(nullable: false, maxLength: 50),
                        NetworkLogDate = c.DateTime(nullable: false),
                        Log = c.String(nullable: false),
                        IncidentTypeId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.NetworkLogId)
                .ForeignKey("dbo.IncidentType", t => t.IncidentTypeId, cascadeDelete: true)
                .ForeignKey("dbo.Servers", t => t.ServerId, cascadeDelete: true)
                .Index(t => t.ServerId)
                .Index(t => t.IncidentTypeId);
            
            CreateTable(
                "dbo.Logs",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        Application = c.String(nullable: false, maxLength: 30),
                        Method = c.String(nullable: false, maxLength: 255),
                        LogLevel = c.Byte(nullable: false),
                        Level = c.String(nullable: false, maxLength: 8),
                        UserAccount = c.String(nullable: false, maxLength: 255),
                        Message = c.String(nullable: false, maxLength: 4000),
                        Exception = c.String(maxLength: 4000),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.ApplicationUserApplicationServers",
                c => new
                    {
                        ApplicationUser_Id = c.String(nullable: false, maxLength: 128),
                        ApplicationServer_ServerId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.ApplicationUser_Id, t.ApplicationServer_ServerId })
                .ForeignKey("dbo.AspNetUsers", t => t.ApplicationUser_Id, cascadeDelete: true)
                .ForeignKey("dbo.Servers", t => t.ApplicationServer_ServerId, cascadeDelete: true)
                .Index(t => t.ApplicationUser_Id)
                .Index(t => t.ApplicationServer_ServerId);
            
            CreateTable(
                "dbo.IncidentIncidentNotes",
                c => new
                    {
                        Incident_IncidentId = c.Long(nullable: false),
                        IncidentNote_IncidentNoteId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => new { t.Incident_IncidentId, t.IncidentNote_IncidentNoteId })
                .ForeignKey("dbo.Incident", t => t.Incident_IncidentId, cascadeDelete: true)
                .ForeignKey("dbo.IncidentNote", t => t.IncidentNote_IncidentNoteId, cascadeDelete: true)
                .Index(t => t.Incident_IncidentId)
                .Index(t => t.IncidentNote_IncidentNoteId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.NetworkLog", "ServerId", "dbo.Servers");
            DropForeignKey("dbo.NetworkLog", "IncidentTypeId", "dbo.IncidentType");
            DropForeignKey("dbo.IncidentNote", "NoteTypeId", "dbo.NoteType");
            DropForeignKey("dbo.Incident", "ServerId", "dbo.Servers");
            DropForeignKey("dbo.Incident", "NIC_Id", "dbo.NIC");
            DropForeignKey("dbo.IncidentIncidentNotes", "IncidentNote_IncidentNoteId", "dbo.IncidentNote");
            DropForeignKey("dbo.IncidentIncidentNotes", "Incident_IncidentId", "dbo.Incident");
            DropForeignKey("dbo.ApplicationUserApplicationServers", "ApplicationServer_ServerId", "dbo.Servers");
            DropForeignKey("dbo.ApplicationUserApplicationServers", "ApplicationUser_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUsers", "CompanyId", "dbo.Companies");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Servers", "CompanyId", "dbo.Companies");
            DropIndex("dbo.IncidentIncidentNotes", new[] { "IncidentNote_IncidentNoteId" });
            DropIndex("dbo.IncidentIncidentNotes", new[] { "Incident_IncidentId" });
            DropIndex("dbo.ApplicationUserApplicationServers", new[] { "ApplicationServer_ServerId" });
            DropIndex("dbo.ApplicationUserApplicationServers", new[] { "ApplicationUser_Id" });
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.NetworkLog", new[] { "IncidentTypeId" });
            DropIndex("dbo.NetworkLog", new[] { "ServerId" });
            DropIndex("dbo.Incident", new[] { "NIC_Id" });
            DropIndex("dbo.Incident", new[] { "ServerId" });
            DropIndex("dbo.IncidentNote", new[] { "NoteTypeId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.AspNetUsers", new[] { "CompanyId" });
            DropIndex("dbo.Servers", "Idx_AspNetServers_ShortName");
            DropIndex("dbo.Servers", new[] { "CompanyId" });
            DropTable("dbo.IncidentIncidentNotes");
            DropTable("dbo.ApplicationUserApplicationServers");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.Logs");
            DropTable("dbo.NetworkLog");
            DropTable("dbo.IncidentType");
            DropTable("dbo.NoteType");
            DropTable("dbo.NIC");
            DropTable("dbo.Incident");
            DropTable("dbo.IncidentNote");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.Servers");
            DropTable("dbo.Companies");
        }
    }
}
