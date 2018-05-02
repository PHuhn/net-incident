using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//
using NSG.Identity;
//
namespace NSG.Identity.Incidents
{
    [Table("NIC")]
    public partial class NIC
    {
        public NIC() { }
        //
        [Key, Column(Order = 1)]
        [Required(ErrorMessage = "NIC_Id is required."), MaxLength(16, ErrorMessage = "'NIC_Id' must be 16 or less characters.")]
        public string NIC_Id { get; set; }
        [Required(ErrorMessage = "NICDescription is required."), MaxLength(255, ErrorMessage = "'NICDescription' must be 255 or less characters.")]
        public string NICDescription { get; set; }
        [MaxLength(50, ErrorMessage = "'NICAbuseEmailAddress' must be 50 or less characters.")]
        public string NICAbuseEmailAddress { get; set; }
        [MaxLength(255, ErrorMessage = "'NICRestService' must be 255 or less characters.")]
        public string NICRestService { get; set; }
        [MaxLength(255, ErrorMessage = "'NICWebSite' must be 255 or less characters.")]
        public string NICWebSite { get; set; }
        //
        public virtual ICollection<Incident> Incidents { get; set; }
        //
    }
}
