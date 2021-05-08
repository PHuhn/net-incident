// ===========================================================================
// File: incident-note.spec.ts
import { IIncidentNote, IncidentNote } from './incident-note';
//
describe('IncidentNote', () => {
	//
	const data: IIncidentNote = new IncidentNote( 1, 1, 'type', 'i 1', new Date( '2000-01-01T00:00:00' ) );
	/*
	** Test for class IncidentNote.
	*/
	it('should create an instance ...', () => {
		expect( data ).toBeTruthy();
	});
	//
	it('should assign correct values ...', () => {
		//
		expect( data.IncidentNoteId ).toEqual( 1 );
		expect( data.NoteTypeId ).toEqual( 1 );
		expect( data.NoteTypeShortDesc ).toEqual( 'type' );
		expect( data.Note ).toEqual( 'i 1' );
		expect( data.CreatedDate ).toEqual( new Date( '2000-01-01T00:00:00' ) );
		expect( data.IsChanged ).toEqual( false );
		//
	});
	/*
	** toString for class IncidentNote.
	*/
	it('toString should output class ...', () => {
		const toStringValue: string = '{"IncidentNoteId":1,"NoteTypeId":1,"NoteTypeShortDesc":"type","Note":"i 1","CreatedDate":"2000-01-01T05:00:00.000Z","IsChanged":false}';
		expect( data.toString() ).toEqual( toStringValue );
	});
	//
});
// ===========================================================================
