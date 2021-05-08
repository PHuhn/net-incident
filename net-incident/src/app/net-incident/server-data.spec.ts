// ===========================================================================
// File: server.spec.ts
import { IServerData, ServerData } from './server-data';
//
describe('Server', () => {
	//
	const data: IServerData = new ServerData( 1, 1, 's cn', 's ssn', 's sn', 's 1', 's ws', 's 1', 's 1', 's 1', 's 1', 's tz', true, 's 1', new Date( '2000-01-01T00:00:00' ), new Date( '2000-01-01T00:00:00' ) );
	/*
	** Test for class Server.
	*/
	it('should create an instance ...', () => {
		expect( data ).toBeTruthy();
	});
	//
	it('should assign correct values ...', () => {
		//
		expect( data.ServerId ).toEqual( 1 );
		expect( data.CompanyId ).toEqual( 1 );
		expect( data.CompanyName ).toEqual( 's cn' );
		expect( data.ServerShortName ).toEqual( 's ssn' );
		expect( data.ServerName ).toEqual( 's sn' );
		expect( data.ServerDescription ).toEqual( 's 1' );
		expect( data.WebSite ).toEqual( 's ws' );
		expect( data.ServerLocation ).toEqual( 's 1' );
		expect( data.FromName ).toEqual( 's 1' );
		expect( data.FromNicName ).toEqual( 's 1' );
		expect( data.FromEmailAddress ).toEqual( 's 1' );
		expect( data.TimeZone ).toEqual( 's tz' );
		expect( data.DST ).toEqual( true );
		expect( data.TimeZone_DST ).toEqual( 's 1' );
		expect( data.DST_Start ).toEqual( new Date( '2000-01-01T00:00:00' ) );
		expect( data.DST_End ).toEqual( new Date( '2000-01-01T00:00:00' ) );
		//
	});
	/*
	** toString for class Server.
	*/
	it('toString should output class ...', () => {
		const toStringValue: string = '{"ServerId":1,"CompanyId":1,"CompanyName":"s cn","ServerShortName":"s ssn","ServerName":"s sn","ServerDescription":"s 1","WebSite":"s ws","ServerLocation":"s 1","FromName":"s 1","FromNicName":"s 1","FromEmailAddress":"s 1","TimeZone":"s tz","DST":true,"TimeZone_DST":"s 1","DST_Start":"2000-01-01T05:00:00.000Z","DST_End":"2000-01-01T05:00:00.000Z"}';
		expect( data.toString() ).toEqual( toStringValue );
	});
	//
});
// ===========================================================================
