//
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//
using NSG.Identity;
//
namespace NSG.Identity.Incidents
{
    [Table("NetworkLog")]
    public partial class NetworkLog
    {
        public NetworkLog() { }
        //
        [Key, Column(Order = 1)]
        [Required(ErrorMessage = "NetworkLogId is required.")]
        public long NetworkLogId { get; set; }
        [Required(ErrorMessage = "ServerId is required.")]
        public int ServerId { get; set; }
        public long? IncidentId { get; set; }
        [Required(ErrorMessage = "IPAddress is required."), MaxLength(50, ErrorMessage = "'IPAddress' must be 50 or less characters.")]
        public string IPAddress { get; set; }
        [Required(ErrorMessage = "NetworkLogDate is required.")]
        public DateTime NetworkLogDate { get; set; }
        [Required(ErrorMessage = "Log is required."), MaxLength(1073741823, ErrorMessage = "'Log' must be 1073741823 or less characters.")]
        public string Log { get; set; }
        [Required(ErrorMessage = "IncidentTypeId is required.")]
        public int IncidentTypeId { get; set; }
        //
        public virtual IncidentType IncidentType { get; set; }
        public virtual ApplicationServer Server { get; set; }
    }
}
//
