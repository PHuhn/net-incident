// ===========================================================================
// File: incident-type.spec.ts
import { IIncidentType, IncidentType } from './incident-type';
//
describe('IncidentType', () => {
	//
	const data: IIncidentType = new IncidentType( 1, 'i 1', 'i 1', true, 'i 1', 'i 1', 'i 1', 'i 1', 'i 1', 'i 1' );
	/*
	** Test for class IncidentType.
	*/
	it('should create an instance ...', () => {
		expect( data ).toBeTruthy();
	});
	//
	it('should assign correct values ...', () => {
		//
		expect( data.IncidentTypeId ).toEqual( 1 );
		expect( data.IncidentTypeShortDesc ).toEqual( 'i 1' );
		expect( data.IncidentTypeDesc ).toEqual( 'i 1' );
		expect( data.IncidentTypeFromServer ).toEqual( true );
		expect( data.IncidentTypeSubjectLine ).toEqual( 'i 1' );
		expect( data.IncidentTypeEmailTemplate ).toEqual( 'i 1' );
		expect( data.IncidentTypeTimeTemplate ).toEqual( 'i 1' );
		expect( data.IncidentTypeThanksTemplate ).toEqual( 'i 1' );
		expect( data.IncidentTypeLogTemplate ).toEqual( 'i 1' );
		expect( data.IncidentTypeTemplate ).toEqual( 'i 1' );
		//
	});
	/*
	** toString for class IncidentType.
	*/
	it('toString should output class ...', () => {
		const toStringValue: string = '{"IncidentTypeId":1,"IncidentTypeShortDesc":"i 1","IncidentTypeDesc":"i 1","IncidentTypeFromServer":true,"IncidentTypeSubjectLine":"i 1","IncidentTypeEmailTemplate":"i 1","IncidentTypeTimeTemplate":"i 1","IncidentTypeThanksTemplate":"i 1","IncidentTypeLogTemplate":"i 1","IncidentTypeTemplate":"i 1"}';
		expect( data.toString() ).toEqual( toStringValue );
	});
	//
});
// ===========================================================================
