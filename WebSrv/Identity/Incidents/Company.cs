using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//
using NSG.Identity;
//
namespace NSG.Identity.Incidents
{
    [Table("Companies")]
    public class Company
    {
        [Key]
        public int CompanyId { get; set; }
        //
        [Index("Idx_Companies_ShortName", IsUnique = true)]
        [Required(ErrorMessage = "'Company Short Name' is required."),
            MinLength(3, ErrorMessage = "'Company Short Name' must be 6 or up to 12 characters."),
            MaxLength(12, ErrorMessage = "'Company Short Name' must be 12 or less characters.")]
        public string CompanyShortName { get; set; }
        //
        [Required(ErrorMessage = "'Company Name' is required."),
            MinLength(3, ErrorMessage = "'Company Name' must be at least 3 characters, up to 80 character."),
            MaxLength(80, ErrorMessage = "'Company Name' must be at least 3 characters, up to 80 character.")]
        public string CompanyName { get; set; }
        //
        public virtual ICollection<ApplicationServer> Servers { get; set; }
        public virtual ICollection<ApplicationUser> Users { get; set; }
        //
    }
}
//