// ===========================================================================
//	File: security.spec.ts
//
import { TestBed, getTestBed } from '@angular/core/testing';
//
import { IUser, User } from './user';
import { Security } from './security';
//
describe('Security', () => {
	//
	const user: User = new User('e0-01','U1','U','N','U N','U','UN1@yahoo.com',true,'734-555-1212', true,1, [],'srv 1',undefined,[]);
	//
	it('should be created ...', ( ) => {
		console.log(
			'=================================\n' +
			'Security: should create ...' );
		user.Roles = [];
		const sut: Security = new Security( user );
        expect( sut ).toBeTruthy();
	});
	//
	it('with role User should allow all ...', ( ) => {
		user.Roles = ['User'];
		const sut: Security = new Security( user );
		expect( sut.isValidIncidentGrid( ) ).toBe( true );
		expect( sut.isValidIncidentDetail( ) ).toBe( true );
	});
	//
	it('with role Admin should allow all ...', ( ) => {
		user.Roles = ['Admin'];
		const sut: Security = new Security( user );
		expect( sut.isValidIncidentGrid( ) ).toBe( true );
		expect( sut.isValidIncidentDetail( ) ).toBe( true );
	});
	//
	it('with role Public should allow grid ...', ( ) => {
		user.Roles = ['Public'];
		const sut: Security = new Security( user );
		expect( sut.isValidIncidentGrid( ) ).toBe( true );
		expect( sut.isValidIncidentDetail( ) ).toBe( false );
	});
	//
	it('with role Public and Admin should allow all ...', ( ) => {
		user.Roles = ['Public', 'Admin'];
		const sut: Security = new Security( user );
		expect( sut.isValidIncidentGrid( ) ).toBe( true );
		expect( sut.isValidIncidentDetail( ) ).toBe( true );
	});
	//
	it('with no roles not should allow any ...', ( ) => {
		user.Roles = [];
		const sut: Security = new Security( user );
		expect( sut.isValidIncidentGrid( ) ).toBe( false );
		expect( sut.isValidIncidentDetail( ) ).toBe( false );
	});
	//
	it('with roles Pub should not allow amy ...', ( ) => {
		user.Roles = ['Pub'];
		const sut: Security = new Security( user );
		expect( sut.isValidIncidentGrid( ) ).toBe( false );
		expect( sut.isValidIncidentDetail( ) ).toBe( false );
		console.log(
			'End of Security ...\n' +
			'=================================' );
	});
	//
});
