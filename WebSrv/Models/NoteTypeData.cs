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
// NoteTypeId	int	int
// NoteTypeDesc	string	nvarchar
// NoteTypeShortDesc	string	nvarchar
//
// ---------------------------------------------------------------------------
//NoteType table from the NetworkIncident2 database.
//
namespace WebSrv.Models
{
    public class NoteTypeData
    {
        #region "Class Properties"
        //
        /// <summary>
        /// For column NoteTypeId
        /// </summary>
        public int NoteTypeId { get; set; }
        //
        /// <summary>
        /// For column NoteTypeShortDesc
        /// </summary>
        public string NoteTypeShortDesc { get; set; }
        //
        /// <summary>
        /// For column NoteTypeDesc
        /// </summary>
        public string NoteTypeDesc { get; set; }
        //
        /// <summary>
        /// Create a 'to string'.
        /// </summary>
        public override string ToString()
        {
            //
            StringBuilder _return = new StringBuilder("record:[");
            _return.AppendFormat("NoteTypeId: {0}, ", NoteTypeId.ToString());
            _return.AppendFormat("NoteTypeShortDesc: {0}, ", NoteTypeShortDesc);
            _return.AppendFormat("NoteTypeDesc: {0}]", NoteTypeDesc);
            return _return.ToString();
        }
        //
        #endregion
    }
    //
    /// <summary>
    /// CRUD for NoteType table access.
    /// </summary>
    public class NoteTypeAccess : IDisposable
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
        public NoteTypeAccess()
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
        public NoteTypeAccess(ApplicationDbContext networkIncidentEntities)
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
        // Return an IQueryable of NoteType
        //
        private IQueryable<NoteTypeData> ListNoteTypeQueryable()
        {
            return
                from _r in _niEntities.NoteTypes
                select new NoteTypeData()
                {
                    NoteTypeId = _r.NoteTypeId,
                    NoteTypeShortDesc = _r.NoteTypeShortDesc,
                    NoteTypeDesc = _r.NoteTypeDesc
                };
        }
        //
        // Return a list with all rows of NoteType
        //
        public List<NoteTypeData> List()
        {
            List<NoteTypeData> _noteTypes = null;
            _noteTypes = ListNoteTypeQueryable().ToList();
            return _noteTypes;
        }
        //
        // Return one row of NoteType
        //
        public NoteTypeData GetByPrimaryKey(int noteTypeId)
        {
            NoteTypeData _noteType = null;
            var _noteTypes = ListNoteTypeQueryable()
                .Where(_r => _r.NoteTypeId == noteTypeId);
            if (_noteTypes.Count() > 0)
            {
                _noteType = _noteTypes.First();
            }
            return _noteType;
        }
        //
        // Insert one row into NoteType
        //
        public int Insert(ref int noteTypeId, string noteTypeDesc, string noteTypeShortDesc)
        {
            int _return = 0;
            NoteType _noteType = new NoteType();
            _noteType.NoteTypeDesc = noteTypeDesc;
            _noteType.NoteTypeShortDesc = noteTypeShortDesc;
            _niEntities.NoteTypes.Add(_noteType);
            _niEntities.SaveChanges();
            noteTypeId = _noteType.NoteTypeId;
            _return = 1;	// one row updated
            return _return;
        }
        //
        // Update one row of NoteType
        //
        public int Update(int noteTypeId, string noteTypeDesc, string noteTypeShortDesc)
        {
            int _return = 0;
            var _noteTypes = from _r in _niEntities.NoteTypes
                             where _r.NoteTypeId == noteTypeId
                             select _r;
            if (_noteTypes.Count() > 0)
            {
                NoteType _noteType = _noteTypes.First();
                _noteType.NoteTypeId = noteTypeId;
                _noteType.NoteTypeDesc = noteTypeDesc;
                _noteType.NoteTypeShortDesc = noteTypeShortDesc;
                _niEntities.SaveChanges();
                _return = 1;	// one row updated
            }
            return _return;
        }
        //
        // Delete one row from NoteType
        //
        public int Delete(int noteTypeId)
        {
            int _return = 0;
            var _noteTypes =
                from _r in _niEntities.NoteTypes
                where _r.NoteTypeId == noteTypeId
                select _r;
            if (_noteTypes.Count() > 0)
            {
                if( _niEntities.IncidentNotes.Where( _n => _n.NoteTypeId == noteTypeId ).Count() == 0 )
                {
                    NoteType _noteType = _noteTypes.First();
                    _niEntities.NoteTypes.Remove(_noteType);
                    _niEntities.SaveChanges();
                    _return = 1;	// one row updated
                }
            }
            return _return;
        }
        //
        #endregion
        //
    }
    //
}
