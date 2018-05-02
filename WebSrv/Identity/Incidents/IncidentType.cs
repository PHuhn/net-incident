using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//
using NSG.Identity;
//
namespace NSG.Identity.Incidents
{
    [Table("IncidentType")]
    public partial class IncidentType
    {
        public IncidentType() { }
        //
        [Key, Column(Order = 1)]
        [Required(ErrorMessage = "IncidentTypeId is required.")]
        public int IncidentTypeId { get; set; }
        [Index("Idx_IncidentType_ShortDesc", IsUnique = true)]
        [Required(ErrorMessage = "IncidentTypeShortDesc is required."), MaxLength(8, ErrorMessage = "'IncidentTypeShortDesc' must be 8 or less characters.")]
        public string IncidentTypeShortDesc { get; set; }
        [Required(ErrorMessage = "IncidentTypeDesc is required."), MaxLength(50, ErrorMessage = "'IncidentTypeDesc' must be 50 or less characters.")]
        public string IncidentTypeDesc { get; set; }
        [Required(ErrorMessage = "IncidentTypeFromServer is required.")]
        public bool IncidentTypeFromServer { get; set; }
        [Required(ErrorMessage = "IncidentTypeSubjectLine is required."), MaxLength(1073741823, ErrorMessage = "'IncidentTypeSubjectLine' must be 1073741823 or less characters.")]
        public string IncidentTypeSubjectLine { get; set; }
        [Required(ErrorMessage = "IncidentTypeEmailTemplate is required."), MaxLength(1073741823, ErrorMessage = "'IncidentTypeEmailTemplate' must be 1073741823 or less characters.")]
        public string IncidentTypeEmailTemplate { get; set; }
        [Required(ErrorMessage = "IncidentTypeTimeTemplate is required."), MaxLength(1073741823, ErrorMessage = "'IncidentTypeTimeTemplate' must be 1073741823 or less characters.")]
        public string IncidentTypeTimeTemplate { get; set; }
        [Required(ErrorMessage = "IncidentTypeThanksTemplate is required."), MaxLength(1073741823, ErrorMessage = "'IncidentTypeThanksTemplate' must be 1073741823 or less characters.")]
        public string IncidentTypeThanksTemplate { get; set; }
        [Required(ErrorMessage = "IncidentTypeLogTemplate is required."), MaxLength(1073741823, ErrorMessage = "'IncidentTypeLogTemplate' must be 1073741823 or less characters.")]
        public string IncidentTypeLogTemplate { get; set; }
        [Required(ErrorMessage = "IncidentTypeTemplate is required."), MaxLength(1073741823, ErrorMessage = "'IncidentTypeTemplate' must be 1073741823 or less characters.")]
        public string IncidentTypeTemplate { get; set; }
        //
        public virtual ICollection<NetworkLog> NetworkLogs { get; set; }
        //
    }
}
