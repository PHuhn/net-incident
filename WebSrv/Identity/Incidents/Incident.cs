using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//
using NSG.Identity;
//
namespace NSG.Identity.Incidents
{
    [Table("Incident")]
    public partial class Incident
    {
        //
        public Incident() { }
        //
        [Key, Column(Order = 1)]
        [Required(ErrorMessage = "IncidentId is required.")]
        public long IncidentId { get; set; }
        [Required(ErrorMessage = "ServerId is required.")]
        public int ServerId { get; set; }
        [Required(ErrorMessage = "IPAddress is required."), MaxLength(50, ErrorMessage = "'IPAddress' must be 50 or less characters.")]
        public string IPAddress { get; set; }
        [Required(ErrorMessage = "NIC_Id is required."), MaxLength(16, ErrorMessage = "'NIC_Id' must be 16 or less characters.")]
        public string NIC_Id { get; set; }
        [MaxLength(255, ErrorMessage = "'NetworkName' must be 255 or less characters.")]
        public string NetworkName { get; set; }
        [MaxLength(255, ErrorMessage = "'AbuseEmailAddress' must be 255 or less characters.")]
        public string AbuseEmailAddress { get; set; }
        [MaxLength(50, ErrorMessage = "'ISPTicketNumber' must be 50 or less characters.")]
        public string ISPTicketNumber { get; set; }
        [Required(ErrorMessage = "Mailed is required.")]
        public bool Mailed { get; set; }
        [Required(ErrorMessage = "Closed is required.")]
        public bool Closed { get; set; }
        [Required(ErrorMessage = "Special is required.")]
        public bool Special { get; set; }
        [MaxLength(1073741823, ErrorMessage = "'Notes' must be 1073741823 or less characters.")]
        public string Notes { get; set; }
        public DateTime CreatedDate { get; set; }
        //
        public virtual ApplicationServer Server { get; set; }
        public virtual NIC NIC { get; set; }
        public virtual ICollection<IncidentNote> IncidentNotes { get; set; }
        //
    }
}
