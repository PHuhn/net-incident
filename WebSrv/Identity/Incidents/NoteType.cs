using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//
using NSG.Identity;
//
namespace NSG.Identity.Incidents
{
    [Table("NoteType")]
    public partial class NoteType
    {
        //
        [Key, Column(Order = 1)]
        [Required(ErrorMessage = "NoteTypeId is required.")]
        public int NoteTypeId { get; set; }
        [Required(ErrorMessage = "NoteTypeShortDesc is required."), MaxLength(8, ErrorMessage = "'NoteTypeShortDesc' must be 8 or less characters.")]
        public string NoteTypeShortDesc { get; set; }
        [Required(ErrorMessage = "NoteTypeDesc is required."), MaxLength(50, ErrorMessage = "'NoteTypeDesc' must be 50 or less characters.")]
        public string NoteTypeDesc { get; set; }
        //
        public virtual ICollection<IncidentNote> IncidentNotes { get; set; }
        //
    }
}
//
