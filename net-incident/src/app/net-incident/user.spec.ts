// ===========================================================================
// File: asp-net-user.spec.ts
import { IUser, User } from './user';
//
describe('User', () => {
	//
	const data: IUser = new User( 'u 1', 'u un', 'u fn', 'u ln', 'u fn', 'u unn', 'u em', true, 'u pn', true, 1, [], 'u ssn', undefined, ['adm'] );
	/*
	** Test for class AspNetUser.
	*/
	it('should create an instance ...', () => {
		expect( data ).toBeTruthy();
	});
	//
	it('should assign correct values ...', () => {
		//
		expect( data.Id ).toEqual( 'u 1' );
		expect( data.UserName ).toEqual( 'u un' );
		expect( data.FirstName ).toEqual( 'u fn' );
		expect( data.LastName ).toEqual( 'u ln' );
		expect( data.FullName ).toEqual( 'u fn' );
		expect( data.UserNicName ).toEqual( 'u unn' );
		expect( data.Email ).toEqual( 'u em' );
		expect( data.EmailConfirmed ).toEqual( true );
		expect( data.PhoneNumber ).toEqual( 'u pn' );
		expect( data.PhoneNumberConfirmed ).toEqual( true );
		expect( data.CompanyId ).toEqual( 1 );
		expect( data.ServerShortNames.length ).toEqual( 0 );
		expect( data.ServerShortName ).toEqual( 'u ssn' );
		expect( data.Server ).toBeUndefined( );
		expect( data.Roles.length ).toEqual( 1 );
		//
	});
	/*
	** toString for class AspNetUser.
	*/
	it('toString should output class ...', () => {
		const toStringValue: string = '{"Id":"u 1","UserName":"u un","FirstName":"u fn","LastName":"u ln","FullName":"u fn","UserNicName":"u unn","Email":"u em","EmailConfirmed":true,"PhoneNumber":"u pn","PhoneNumberConfirmed":true,"CompanyId":1,"ServerShortNames":[],"ServerShortName":"u ssn","Roles":["adm"]}';
		expect( data.toString() ).toEqual( toStringValue );
	});
	//
});
// ===========================================================================
