//
// ---------------------------------------------------------------------------
// Brief Description: 
//
//
// Author: Phil Huhn
// Created Date: 2017/11/13
// ---------------------------------------------------------------------------
// Modified By:
// Modification Date:
// Purpose of Modification:
// ---------------------------------------------------------------------------
//
using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
//
using NSG.Identity;
using NSG.Identity.Incidents;
//
// IncidentNotesId	long	bigint
// CompanyId	int	int
// NotesTypeId	int	int
// Notes	string	nvarchar
// CreatedDate	DateTime	datetime
//
// ---------------------------------------------------------------------------
//IncidentNotes table from the NetworkIncident2 database.
//
namespace WebSrv.Models
{
    public class IncidentNoteData
    {
        #region "Class Properties"
        //
        /// <summary>
        /// For column IncidentNotesId
        /// </summary>
        public long IncidentNoteId { get; set; }
        //
        /// <summary>
        /// For column NotesTypeId
        /// </summary>
        public int NoteTypeId { get; set; }
        //
        /// <summary>
        /// For column NoteTypeShortDesc from NoteType
        /// </summary>
        public string NoteTypeShortDesc { get; set; }
        //
        /// <summary>
        /// For column Notes
        /// </summary>
        public string Note { get; set; }
        //
        /// <summary>
        /// For column CreatedDate
        /// </summary>
        public DateTime CreatedDate { get; set; }
        //
        /// <summary>
        /// For pseudo column, for change tracking
        /// </summary>
        public bool IsChanged { get; set; }
        //
        /// <summary>
        /// Create a 'to string'.
        /// </summary>
        public override string ToString()
        {
            //
            StringBuilder _return = new StringBuilder("record:[");
            _return.AppendFormat("IncidentNotesId: {0}, ", IncidentNoteId.ToString());
            _return.AppendFormat("NoteTypeId: {0}, ", NoteTypeId.ToString());
            _return.AppendFormat("NoteTypeShortDesc: {0}, ", NoteTypeShortDesc);
            _return.AppendFormat("Note: {0}, ", Note);
            _return.AppendFormat("CreatedDate: {0}]", CreatedDate.ToString());
            return _return.ToString();
        }
        //
        #endregion
    }
    //
    /// <summary>
    /// CRUD for IncidentNotes table access.
    /// </summary>
    public class IncidentNoteAccess : IDisposable
    {
        //
        // -------------------------------------------------------------------
        //	Constructors
        //		parameter-less
        //
        ApplicationDbContext _niEntities = null;
        bool _external = false;
        //
        #region "Constructors"
        //
        /// <summary>
        /// Create a new object using parameter-less (default) constructor.
        /// </summary>
        public IncidentNoteAccess()
        {
            //
            _niEntities = ApplicationDbContext.Create();
            _external = false;
            //
        }
        //
        /// <summary>
        /// Create a one parameter constructor.
        /// </summary>
        public IncidentNoteAccess(ApplicationDbContext networkIncidentEntities)
        {
            //
            _niEntities = networkIncidentEntities;
            _external = true;
            //
        }
        //
        /// <summary>
        /// Cleanup resources.
        /// </summary>
        public void Dispose()
        {
            //
            if (_external == false)
            {
                _niEntities.Dispose();
            }
            //
        }
        //
        #endregion
        //
        // -------------------------------------------------------------------
        //	Public Access Methods
        //		List
        //		GetByPrimaryKey
        //		Insert
        //		Update
        //		Delete
        //
        #region "Public Access Methods"
        //
        // Return an IQueryable of IncidentNotes
        //
        private IQueryable<IncidentNoteData> ListIncidentNoteQueryable()
        {
            return
                from _r in _niEntities.IncidentNotes
                select new IncidentNoteData()
                {
                    IncidentNoteId = _r.IncidentNoteId,
                    NoteTypeId = _r.NoteTypeId,
                    NoteTypeShortDesc = _r.NoteType.NoteTypeShortDesc,
                    Note = _r.Note,
                    CreatedDate = _r.CreatedDate,
                    IsChanged = false
                };
        }
        //
        // Return a list with all rows of IncidentNote
        //
        public List<IncidentNoteData> ListByIncident( long incidentId )
        {
            // ToIncidentNoteDataList is in Extensions.cs
            return _niEntities.IncidentNotes
                .Where(_r => _r.Incidents.Any(_i => _i.IncidentId == incidentId))
                .AsEnumerable<IncidentNote>()
                .Select(_n => _n.ToIncidentNoteData()).ToList();
        }
        //
        // Return one row of IncidentNotes
        //
        public IncidentNoteData GetByPrimaryKey(long incidentNotesId)
        {
            IncidentNoteData _incidentNote = null;
            var _incidentNotes = ListIncidentNoteQueryable()
                .Where(_r => _r.IncidentNoteId == incidentNotesId);
            if (_incidentNotes.Count() > 0)
            {
                _incidentNote = _incidentNotes.First();
            }
            return _incidentNote;
        }
        //
        // Insert one row into IncidentNotes
        //
        public IncidentNote Insert(IncidentNoteData data)
        {
            IncidentNote _incidentNote = new IncidentNote();
            _incidentNote.NoteTypeId = data.NoteTypeId;
            _incidentNote.Note = data.Note;
            _niEntities.IncidentNotes.Add(_incidentNote);
            return _incidentNote;
        }
        public int InsertSave( IncidentNoteData data )
        {
            int _return = 0;
            IncidentNote _incidentNote = Insert(data);
            _niEntities.SaveChanges();
            _return = 1;
            return _return;
        }
        //
        // Update one row of IncidentNotes
        //
        public int Update( IncidentNoteData data )
        {
            int _return = 0;
            var _incidentNotes =
                from _r in _niEntities.IncidentNotes
                where _r.IncidentNoteId == data.IncidentNoteId
                select _r;
            if (_incidentNotes.Count() > 0)
            {
                IncidentNote _incidentNote = _incidentNotes.First();
                if( _incidentNote.NoteTypeId != data.NoteTypeId )
                    _incidentNote.NoteTypeId = data.NoteTypeId;
                if( _incidentNote.Note != data.Note )
                    _incidentNote.Note = data.Note;
                _return = 1;	// one row updated
            }
            return _return;
        }
        public int UpdateSave( IncidentNoteData data )
        {
            int _return = Update( data );
            if (_return > 0)
                _niEntities.SaveChanges();
            return _return;
        }
        //
        // 
        /// <summary>
        /// Delete one row from IncidentNotes
        /// </summary>
        /// <param name="incidentNoteId">long incident note id</param>
        /// <returns>Row count</returns>
        public int Delete(long incidentNoteId)
        {
            int _return = 0;
            var _incidentNotes = 
                (from _r in _niEntities.IncidentNotes
                where _r.IncidentNoteId == incidentNoteId
                select _r).ToList();
            if (_incidentNotes.Count() > 0)
            {
                IncidentNote _incidentNote = _incidentNotes.First();
                // Foreign key violation [dbo_Incident2IncidentNote :: IncidentNoteId]. The key value [1] does not exists in the referenced table [dbo_IncidentNote :: IncidentNoteId].. Error code: RelationError"}
                // var _incids = _incidentNote.Incidents.ToList();
                foreach (var _incid in _incidentNote.Incidents.ToList())
                {
                    List<IncidentNote> _notes = _incid.IncidentNotes
                        .Where(_n => _n.IncidentNoteId == incidentNoteId).ToList();
                    foreach (IncidentNote _note in _notes)
                    {
                        _niEntities.IncidentNotes.Remove(_note);
                        _return++;
                    }
                }
            }
            return _return;
        }
        public int DeleteSave(long incidentNoteId)
        {
            int _return = Delete( incidentNoteId );
            if (_return > 0)
                _niEntities.SaveChanges();
            return _return;
        }
        //
        #endregion
        //
    }
    //
}
