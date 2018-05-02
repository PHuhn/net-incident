// IncidentTest2Service
// ===========================================================================
// File: Incident.service.spec.ts
// Tests of service for: Incident
//
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
//
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
//
import { environment } from '../../../environments/environment';
import { Message } from '../../global/message';
// import { AlertsService } from '../global/alerts/alerts.service';
import { IncidentTest2Service } from './incident-test2.service';
import { IIncident, Incident } from '../incident';
//
describe('IncidentTest2Service', () => {
	let sut: IncidentTest2Service;
	let http: HttpClient;
	let backend: HttpTestingController;
	let url: string = environment.base_Url + 'Incident';
	let errMsg: string = 'Fake error';
	//
	const mockDatum = [
		new Incident( 1,1,'i 1','i 1','i 1','i 1','i 1',true,true,true,'i 1',new Date( '2000-01-01T00:00:00' ) ),
		new Incident( 2,2,'i 2','i 2','i 2','i 2','i 2',false,false,false,'i 2',new Date( '2000-01-01T00:00:00' ) ),
		new Incident( 3,3,'i 3','i 3','i 3','i 3','i 3',true,true,true,'i 3',new Date( '2000-01-01T00:00:00' ) ),
		new Incident( 4,4,'i 4','i 4','i 4','i 4','i 4',false,false,false,'i 4',new Date( '2000-01-01T00:00:00' ) )
	];
	//
	beforeEach( async( ( ) => {
		TestBed.configureTestingModule( {
			imports: [
				// Aungular 4.3.1
				HttpClientModule,
				HttpClientTestingModule
			],
			providers: [
				IncidentTest2Service
			]
		} );
		// Setup injected pre service for each test
		http = TestBed.get( HttpClient );
		backend = TestBed.get( HttpTestingController );
		// Setup sut
		sut = getTestBed().get( IncidentTest2Service );
		TestBed.compileComponents();
	} ) );
	//
	afterEach( ( ) => {
		// cleanup
	});
	//
	it( 'should create ...', ( ) => {
		console.log( '=================================\n' +
					'IncidentService: should create ...' );
		expect( sut ).toBeTruthy( );
	});
	//
	it( 'should create an empty class ...', ( ) => {
		console.log( 'Should create an empty class ...' );
		let newData: Incident = sut.emptyIncident( );
		expect( newData.IncidentId ).toEqual( 0 );
	});
	//
	// getIncident( id: string ): Observable<IIncident>
	//
	it( 'should get by id (primary key)...', async( ( ) => {
		//
		let mockData: Incident = mockDatum[ 1 ];
		let id1: number = mockData.IncidentId;
		//
		sut.getIncident( id1 ).subscribe( ( data: Incident ) => {
			// console.log( data );
			expect( data.IncidentId ).toEqual( id1 );
		});
		// use the HttpTestingController to mock requests and the flush method to provide dummy values as responses
		const request: TestRequest = backend.expectOne( `${url}/${id1}` );
		expect( request.request.method ).toBe( 'GET' );
		request.flush( mockData );
		//
	}));
	//
	// getIncidents( ): Observable<IIncident[]>
	//
	it( 'should get all IIncident results...', async( ( ) => {
		//
		sut.getIncidents().subscribe( ( datum ) => {
			// console.log( datum );
			expect( datum.length ).toBe( 4 );
			expect( datum[ 0 ].IncidentId ).toEqual( 1 );
			expect( datum[ 1 ].IncidentId ).toEqual( 2 );
			expect( datum[ 2 ].IncidentId ).toEqual( 3 );
			expect( datum[ 3 ].IncidentId ).toEqual( 4 );
		});
		const request: TestRequest = backend.expectOne( `${url}/` );
		expect( request.request.method ).toBe( 'GET' );
		request.flush( mockDatum );
		//
	}));
	//
	// createIncident( Incident: IIncident )
	//
	it( 'should create a new row...', async( ( ) => {
		//
		let mockData: Incident = mockDatum[ 2 ];
		let id1: number = mockData.IncidentId;
		sut.createIncident( mockData ).subscribe(( resp: Incident ) => {
			console.log( resp );
			expect( +resp.IncidentId ).toEqual( id1 );
		});
		//
		const request: TestRequest = backend.expectOne( `${url}` );
		expect( request.request.method ).toBe( 'POST' );
		request.flush( mockData );
		//
	} ) );
	//
	// updateIncident( Incident: IIncident )
	//
	it( 'should update Incident row...', async( ( ) => {
		//
		let mockData: Incident = mockDatum[ 1 ];
		let id1: number = mockData.IncidentId;
		sut.updateIncident( mockData ).subscribe(( resp: Incident ) => {
			console.log( resp );
			expect( +resp.IncidentId ).toEqual( id1 );
		});
		//
		const request: TestRequest = backend.expectOne( `${url}/${id1}` );
		expect( request.request.method ).toBe( 'PUT' );
		request.flush( mockData );
		//
	} ) );
	//
	// deleteIncident( IncidentId: string )
	//
	it( 'should delete Incident row...', async( ( ) => {
		//
		let mockData: Incident = mockDatum[ 3 ];
		let id1: number = mockData.IncidentId;
		sut.deleteIncident( id1 ).subscribe(( resp: Incident ) => {
			// console.log( resp );
			expect( +resp.IncidentId ).toEqual( id1 );
		});
		//
		const request = backend.expectOne( `${url}/${id1}` );
		expect( request.request.method ).toBe( 'DELETE' );
		request.flush( mockData );
		//
	} ) );
	//
	// handleError( error: any )
	//
	it( 'should throw an any error ...', async( ( ) => {
		console.log( 'should throw an any error ...' );
		//
		let resp: string = errMsg;
		//
		sut.handleError( resp ).subscribe( () => {
				console.log( JSON.stringify( resp ) );
				fail( 'handleError: expected error...' );
			}, ( error ) => {
				expect( error ).toEqual( errMsg );
		} );
		//
	} ) );
	//
	// handleError( error: any )
	//
	it( 'should throw a HttpErrorResponse error...', async( ( ) => {
		//
		let resp: HttpErrorResponse = new HttpErrorResponse({
			error: {}, status: 599, statusText: errMsg
		});
		//
		sut.handleError( resp ).subscribe( () => {
				console.log( JSON.stringify( resp ) );
				fail( 'handleError: expected error...' );
			}, ( error ) => {
				expect( error ).toEqual( errMsg );
		} );
		//
	} ) );
	//
	// handle a create error
	//
	it( 'should handle an error on create...', async( ( ) => {
		//
		let mockData: Incident = mockDatum[ 2 ];
		let resp: HttpErrorResponse = new HttpErrorResponse({
			error: {}, status: 401, statusText: errMsg
		});
		//
		sut.createIncident( mockData ).subscribe((resp) => {
				console.log( 'handleError: expected error response:' );
				console.log( resp );
				fail( 'handleError: expected error...' );
			}, ( error ) => {
				expect( error ).toEqual( errMsg ); }
		);
		//
		const request: TestRequest = backend.expectOne( `${url}` );
		expect( request.request.method ).toBe( 'POST' );
		request.flush( 'Invalid request parameters', resp );
		//
	} ) );
	//
	// validate( model: Incident, add: boolean ): Message[]
	//
	it( 'should validate...', () => {
		//
		let model: Incident = new Incident(
			5,5,'i 5','i 5','i 5','i 5','i 5',true,true,true,'i 5',new Date( '2000-01-01T00:00:00' ) );
		let ret: Message[] = sut.validate( model, true );
		expect( ret.length ).toEqual( 0 );
		//
	});
	//
	it( 'should handle a validation Incident Id required error...', ( ) => {
		//
		let incidentidBad: number = undefined;
		let model: Incident = new Incident(
			5,5,'i 5','i 5','i 5','i 5','i 5',true,true,true,'i 5',new Date( '2000-01-01T00:00:00' ) );
		model.IncidentId = incidentidBad;
		let ret: Message[] = sut.validate( model, true );
		// is required.
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) != -1 ).toBe( true );
	} );
	//
	it( 'should handle a validation Server Id required error...', ( ) => {
		//
		let serveridBad: number = undefined;
		let model: Incident = new Incident(
			5,5,'i 5','i 5','i 5','i 5','i 5',true,true,true,'i 5',new Date( '2000-01-01T00:00:00' ) );
		model.ServerId = serveridBad;
		let ret: Message[] = sut.validate( model, true );
		// is required.
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) != -1 ).toBe( true );
	} );
	//
	it( 'should handle a validation Server Id too large error...', ( ) => {
		//
		let serveridBad: number = 2147483648;
		let model: Incident = new Incident(
			5,5,'i 5','i 5','i 5','i 5','i 5',true,true,true,'i 5',new Date( '2000-01-01T00:00:00' ) );
		model.ServerId = serveridBad;
		let ret: Message[] = sut.validate( model, true );
		// is too large, over: #
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'too large' ) != -1 ).toBe( true );
	} );
	//
	it( 'should handle a validation I P Address required error...', ( ) => {
		//
		let ipaddressBad: string = '';
		let model: Incident = new Incident(
			5,5,'i 5','i 5','i 5','i 5','i 5',true,true,true,'i 5',new Date( '2000-01-01T00:00:00' ) );
		model.IPAddress = ipaddressBad;
		let ret: Message[] = sut.validate( model, true );
		// is required.
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) != -1 ).toBe( true );
	} );
	//
	it( 'should handle a validation I P Address max length error...', ( ) => {
		//
		let ipaddressBad: string = 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii';
		let model: Incident = new Incident(
			5,5,'i 5','i 5','i 5','i 5','i 5',true,true,true,'i 5',new Date( '2000-01-01T00:00:00' ) );
		model.IPAddress = ipaddressBad;
		let ret: Message[] = sut.validate( model, true );
		// max length of #.
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'max length' ) != -1 ).toBe( true );
	} );
	//
	it( 'should handle a validation N I C  Id required error...', ( ) => {
		//
		let nic_idBad: string = '';
		let model: Incident = new Incident(
			5,5,'i 5','i 5','i 5','i 5','i 5',true,true,true,'i 5',new Date( '2000-01-01T00:00:00' ) );
		model.NIC = nic_idBad;
		let ret: Message[] = sut.validate( model, true );
		// is required.
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) != -1 ).toBe( true );
	} );
	//
	it( 'should handle a validation N I C  Id max length error...', ( ) => {
		//
		let nic_idBad: string = 'iiiiiiiiiiiiiiiii';
		let model: Incident = new Incident(
			5,5,'i 5','i 5','i 5','i 5','i 5',true,true,true,'i 5',new Date( '2000-01-01T00:00:00' ) );
		model.NIC = nic_idBad;
		let ret: Message[] = sut.validate( model, true );
		// max length of #.
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'max length' ) != -1 ).toBe( true );
	} );
	//
	it( 'should handle a validation Network Name max length error...', ( ) => {
		//
		let networknameBad: string = 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii';
		let model: Incident = new Incident(
			5,5,'i 5','i 5','i 5','i 5','i 5',true,true,true,'i 5',new Date( '2000-01-01T00:00:00' ) );
		model.NetworkName = networknameBad;
		let ret: Message[] = sut.validate( model, true );
		// max length of #.
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'max length' ) != -1 ).toBe( true );
	} );
	//
	it( 'should handle a validation Abuse Email Address max length error...', ( ) => {
		//
		let abuseemailaddressBad: string = 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii';
		let model: Incident = new Incident(
			5,5,'i 5','i 5','i 5','i 5','i 5',true,true,true,'i 5',new Date( '2000-01-01T00:00:00' ) );
		model.AbuseEmailAddress = abuseemailaddressBad;
		let ret: Message[] = sut.validate( model, true );
		// max length of #.
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'max length' ) != -1 ).toBe( true );
	} );
	//
	it( 'should handle a validation I S P Ticket Number max length error...', ( ) => {
		//
		let ispticketnumberBad: string = 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii';
		let model: Incident = new Incident(
			5,5,'i 5','i 5','i 5','i 5','i 5',true,true,true,'i 5',new Date( '2000-01-01T00:00:00' ) );
		model.ISPTicketNumber = ispticketnumberBad;
		let ret: Message[] = sut.validate( model, true );
		// max length of #.
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'max length' ) != -1 ).toBe( true );
	} );
	//
});
// ===========================================================================
