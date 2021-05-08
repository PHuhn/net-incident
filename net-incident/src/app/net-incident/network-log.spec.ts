// ===========================================================================
// File: network-log.spec.ts
import { INetworkLog, NetworkLog } from './network-log';
//
describe('NetworkLog', () => {
	//
	const data: INetworkLog = new NetworkLog( 1, 1, 1, 'n 1', new Date( '2000-01-01T00:00:00' ), 'n 1', 1, 'short', false );
	/*
	** Test for class NetworkLog.
	*/
	it('should create an instance ...', () => {
		expect( data ).toBeTruthy();
	});
	//
	it('should assign correct values ...', () => {
		//
		expect( data.NetworkLogId ).toEqual( 1 );
		expect( data.ServerId ).toEqual( 1 );
		expect( data.IncidentId ).toEqual( 1 );
		expect( data.IPAddress ).toEqual( 'n 1' );
		expect( data.NetworkLogDate ).toEqual( new Date( '2000-01-01T00:00:00' ) );
		expect( data.Log ).toEqual( 'n 1' );
		expect( data.IncidentTypeId ).toEqual( 1 );
		expect( data.IncidentTypeShortDesc ).toEqual( 'short' );
		expect( data.Selected ).toEqual( false );
		expect( data.IsChanged ).toEqual( false );
		//
	});
	/*
	** toString for class NetworkLog.
	*/
	it('toString should output class ...', () => {
		const toStringValue: string = '{"NetworkLogId":1,"ServerId":1,"IncidentId":1,"IPAddress":"n 1","NetworkLogDate":"2000-01-01T05:00:00.000Z","Log":"n 1","IncidentTypeId":1,"IncidentTypeShortDesc":"short","Selected":false,"IsChanged":false}';
		expect( data.toString() ).toEqual( toStringValue );
	});
	//
});
// ===========================================================================
