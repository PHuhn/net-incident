namespace WebSrv.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update20180301v1 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.ApplicationUserApplicationServers", "ApplicationUser_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.ApplicationUserApplicationServers", "ApplicationServer_ServerId", "dbo.Servers");
            DropForeignKey("dbo.IncidentIncidentNotes", "Incident_IncidentId", "dbo.Incident");
            DropForeignKey("dbo.IncidentIncidentNotes", "IncidentNote_IncidentNoteId", "dbo.IncidentNote");
            AddForeignKey("dbo.ApplicationUserApplicationServers", "ApplicationUser_Id", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.ApplicationUserApplicationServers", "ApplicationServer_ServerId", "dbo.Servers", "ServerId");
            AddForeignKey("dbo.IncidentIncidentNotes", "Incident_IncidentId", "dbo.Incident", "IncidentId");
            AddForeignKey("dbo.IncidentIncidentNotes", "IncidentNote_IncidentNoteId", "dbo.IncidentNote", "IncidentNoteId");
            CreateIndex("dbo.IncidentType", "IncidentTypeShortDesc", unique: true, name: "Idx_IncidentType_ShortDesc");
        }

        public override void Down()
        {
            DropForeignKey("dbo.IncidentIncidentNotes", "IncidentNote_IncidentNoteId", "dbo.IncidentNote");
            DropForeignKey("dbo.IncidentIncidentNotes", "Incident_IncidentId", "dbo.Incident");
            DropForeignKey("dbo.ApplicationUserApplicationServers", "ApplicationServer_ServerId", "dbo.Servers");
            DropForeignKey("dbo.ApplicationUserApplicationServers", "ApplicationUser_Id", "dbo.AspNetUsers");
            AddForeignKey("dbo.IncidentIncidentNotes", "IncidentNote_IncidentNoteId", "dbo.IncidentNote", "IncidentNoteId", cascadeDelete: true);
            AddForeignKey("dbo.IncidentIncidentNotes", "Incident_IncidentId", "dbo.Incident", "IncidentId", cascadeDelete: true);
            AddForeignKey("dbo.ApplicationUserApplicationServers", "ApplicationServer_ServerId", "dbo.Servers", "ServerId", cascadeDelete: true);
            AddForeignKey("dbo.ApplicationUserApplicationServers", "ApplicationUser_Id", "dbo.AspNetUsers", "Id", cascadeDelete: true);
            DropIndex("dbo.IncidentType", "Idx_IncidentType_ShortDesc");
        }
    }
}
