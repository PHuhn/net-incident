using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//
using NSG.Identity;
//
namespace NSG.Identity.Incidents
{
    [Table("IncidentNote")]
    public partial class IncidentNote
    {
        //
        public IncidentNote() { }
        //
        [Key, Column(Order = 1)]
        [Required(ErrorMessage = "IncidentNoteId is required.")]
        public long IncidentNoteId { get; set; }
        [Required(ErrorMessage = "NoteTypeId is required.")]
        public int NoteTypeId { get; set; }
        [Required(ErrorMessage = "Note is required."), MaxLength(1073741823, ErrorMessage = "'Note' must be 1073741823 or less characters.")]
        public string Note { get; set; }
        public DateTime CreatedDate { get; set; }
        //
        public virtual NoteType NoteType { get; set; }
        public virtual ICollection<Incident> Incidents { get; set; }
        //
    }
}
