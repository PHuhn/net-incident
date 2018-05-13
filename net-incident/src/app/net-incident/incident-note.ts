// ===========================================================================
// File: IncidentNote.ts
//  define the interface(IIncidentNote/class(IncidentNote)
//
export interface IIncidentNote {
	IncidentNoteId: number;
	NoteTypeId: number;
	NoteTypeShortDesc: string;
	Note: string;
	CreatedDate: Date;
	IsChanged: boolean;
}
//
export class IncidentNote implements IIncidentNote {
	//
	// public IsChanged: Boolean;
	// using short-hand declaration...
	constructor(
		public IncidentNoteId: number,
		public NoteTypeId: number,
		public NoteTypeShortDesc: string,
		public Note: string,
		public CreatedDate: Date,
		public IsChanged: boolean = false
	) {
	}
}
// ===========================================================================
