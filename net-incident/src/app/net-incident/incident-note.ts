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
	//
	toString(): string;
	//
}
//
export class IncidentNote implements IIncidentNote {
	//
	// public IsChanged: Boolean;
	public static empty( ): IIncidentNote {
		return new IncidentNote(
			0, 0, '', '', new Date( Date.now() ), true
		);
	}
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
	/*
	** toString implementation for class IncidentNote
	*/
	public toString = (): string => {
		return JSON.stringify( this );
	}
	//
}
// ===========================================================================
