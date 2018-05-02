//
using System;
using System.Linq;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Data.Entity.Infrastructure;
//
using NSG.Identity.Incidents;
//
namespace NSG.Identity
{
    //
    public partial class ApplicationDbContext
    {
        //
        // ---------------------------------------------------------------------------
        // Insert duplicate validation.
        //
        protected override DbEntityValidationResult ValidateEntity(
                DbEntityEntry entityEntry, IDictionary<object, object> items)
        {
            if (entityEntry.Entity is ApplicationUser && entityEntry.State == EntityState.Added)
            {
                if (Users.Any(a =>
                    a.UserName == ((ApplicationUser)entityEntry.Entity).UserName
                    || a.Email == ((ApplicationUser)entityEntry.Entity).Email
                    || a.FullName == ((ApplicationUser)entityEntry.Entity).FullName
                    ))
                {
                    // return validation error
                    return new DbEntityValidationResult(entityEntry, new List<DbValidationError>()
                        { new DbValidationError("User", 
                        string.Format( "Duplicate User: '{0}' or '{1}' or '{2}'",
                            ((ApplicationUser)entityEntry.Entity).UserName,
                            ((ApplicationUser)entityEntry.Entity).Email,
                            ((ApplicationUser)entityEntry.Entity).FullName))
                    });
                }
            }
            if (entityEntry.Entity is Company && entityEntry.State == EntityState.Added)
            {
                if (Companies.Any(a => a.CompanyName == ((Company)entityEntry.Entity).CompanyName))
                {
                    // return validation error
                    return new DbEntityValidationResult(entityEntry, new List<DbValidationError>()
                        { new DbValidationError("Company",
                        string.Format( "Duplicate Company: '{0}'",
                            ((Company)entityEntry.Entity).CompanyName)) });
                }
            }
            //
            if (entityEntry.Entity is IncidentType && entityEntry.State == EntityState.Added)
            {
                if (IncidentTypes.Any(a =>
                    a.IncidentTypeShortDesc == ((IncidentType)entityEntry.Entity).IncidentTypeShortDesc 
                    || a.IncidentTypeDesc == ((IncidentType)entityEntry.Entity).IncidentTypeDesc
                    ))
                {
                    // return validation error
                    return new DbEntityValidationResult(entityEntry, new List<DbValidationError>()
                        { new DbValidationError("IncidentType", 
                        string.Format( "Duplicate IncidentType: '{0}' or '{1}'",
                            ((IncidentType)entityEntry.Entity).IncidentTypeShortDesc,
                            ((IncidentType)entityEntry.Entity).IncidentTypeShortDesc))
                        });
                }
            }
            //
            if (entityEntry.Entity is NIC && entityEntry.State == EntityState.Added)
            {
                if (NICs.Any(a =>
                    a.NIC_Id == ((NIC)entityEntry.Entity).NIC_Id
                    || a.NICDescription == ((NIC)entityEntry.Entity).NICDescription
                    ))
                {
                    // return validation error
                    return new DbEntityValidationResult(entityEntry, new List<DbValidationError>()
                        { new DbValidationError("NIC",
                        string.Format( "Duplicate NIC: '{0}' or '{1}'",
                            ((NIC)entityEntry.Entity).NIC_Id,
                            ((NIC)entityEntry.Entity).NICDescription))
                    });
                }
            }
            if (entityEntry.Entity is NoteType && entityEntry.State == EntityState.Added)
            {
                if (NoteTypes.Any(a => a.NoteTypeDesc == ((NoteType)entityEntry.Entity).NoteTypeDesc))
                {
                    // return validation error
                    return new DbEntityValidationResult(entityEntry, new List<DbValidationError>()
                        { new DbValidationError("NoteType", "Duplicate NoteType: '" +
                        ((NoteType)entityEntry.Entity).NoteTypeDesc + "'") });
                }
            }
            //
            return base.ValidateEntity(entityEntry, items);
        }
        //
    }
    //
}
//
