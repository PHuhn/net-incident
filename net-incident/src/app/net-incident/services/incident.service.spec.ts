// ===========================================================================
//	File: Incident.service.spec.ts
//	Tests of service for: Incident
//
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
//
import { HttpClientModule, HttpClient, HttpErrorResponse, HttpRequest, HttpResponseBase } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
//
import { environment } from '../../../environments/environment';
import { Message } from '../../global/message';
//import { AlertsService } from '../../global/alerts/alerts.service';
import { IncidentService } from './incident.service';
import { IIncident, Incident } from '../incident';
//
describe('IncidentService', () => {
	let sut: IncidentService;
	let http: HttpClient;
	let backend: HttpTestingController;
	const url: string = environment.base_Url + 'Incident';
	const errMsg: string = 'Fake error';
	const testDate: Date = new Date('2000-01-01T00:00:00');
	//
	const mockDatum = [
		new Incident( 1,1,'192.1','ripe.net','nn1','a@1.com','',true,true,true,'i 1',testDate ),
		new Incident( 2,1,'192.2','ripe.net','nn2','a@2.com','',false,false,false,'i 2',testDate ),
		new Incident( 3,1,'192.3','arin.net','nn3','a@3.com','',true,true,true,'i 3',testDate ),
		new Incident( 4,1,'192.4','ripe.net','nn4','a@4.com','',false,false,false,'i 4',testDate ),
		new Incident( 5,2,'192.5','ripe.net','nn4','a@4.com','',false,false,false,'i 4',testDate )
	];
	//
	beforeEach( async( ( ) => {
		TestBed.configureTestingModule( {
			imports: [
				// HttpClient 4.3 testing
				HttpClientModule,
				HttpClientTestingModule
			],
			providers: [
				IncidentService
			]
		} );
		// Setup injected pre service for each test
		http = TestBed.get( HttpClient );
		backend = TestBed.get( HttpTestingController );
		// Setup sut
		sut = getTestBed().get( IncidentService );
		TestBed.compileComponents();
	} ) );
	//
	afterEach( ( ) => {
		// cleanup
		backend.verify();
	});
	//
	it( 'should create ...', ( ) => {
		console.log(
			'===================================\n' +
			'IncidentService should create ...' );
		expect( sut ).toBeTruthy( );
	});
	//
	it( 'should create an empty class ...', ( ) => {
		let newData: Incident = sut.emptyIncident( );
		expect( newData.IncidentId ).toEqual( 0 );
	});
	//
	//	getIncident( id: string ) : Observable<IIncident>
	//
	it( 'should get by id (primary key)...', async( ( ) => {
		//
		let mockData: Incident = mockDatum[ 1 ];
		let id1: number = mockData.IncidentId;
		sut.getIncident( id1 ).subscribe( ( data: Incident ) => {
			// console.log( data );
			expect( data.IncidentId ).toEqual( id1 );
		});
		// use the HttpTestingController to mock requests and the flush method to provide dummy values as responses
		// https://angular.io/guide/http#expecting-and-answering-requests
		// use expectOne(), expectNone() and match() 
		const request = backend.expectOne( `${url}/${id1}` );
		expect( request.request.method ).toBe( 'GET' );
		request.flush( mockData );
		//
	}));
	//
	//	getIncidents( ) : Observable<IIncident[]>
	//
	it( 'should get all IIncident results...', async( ( ) => {
		//
		const srvId: number = 1;
		sut.getIncidents(1, false, false, false).subscribe( ( datum ) => {
			expect( datum.length ).toBe( 4 );
			expect( datum[ 1 ].IncidentId ).toEqual( 2 );
			expect( datum[ 3 ].IncidentId ).toEqual( 4 );
		});
		const request = backend.expectOne( `${url}/${srvId}?mailed=false&closed=false&special=false` );
		expect( request.request.method ).toBe( 'GET' );
		request.flush( mockDatum.slice(0, 4) );
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
			expect( resp.IncidentId ).toEqual( id1 );
		});
		const request: TestRequest = backend.expectOne( `${url}/` );
		expect( request.request.method ).toBe( 'POST' );
		request.flush( mockData );
		//
	} ) );
	//
	// updateIncident( Incident: IIncident )
	//
	it( 'should update Incident row...', async( ( ) => {
		//
		let mockData: Incident = mockDatum[ 2 ];
		let id1: number = mockData.IncidentId;
		sut.updateIncident( mockData ).subscribe(( resp: Incident ) => {
			expect( resp.IncidentId ).toEqual( id1 );
		});
		const request: TestRequest = backend.expectOne( `${url}/${id1}` );
		expect( request.request.method ).toBe( 'PUT' );
		request.flush( mockData );
		//
	} ) );
	//
	//	deleteIncident( IncidentId: string )
	//	204 says explicitly that you do not include a response body
	//
	it( 'should delete Incident row...', async( ( ) => {
		//
		let mockData: Incident = mockDatum[ 2 ];
		let id1: number = mockData.IncidentId;
		sut.deleteIncident( id1 ).subscribe(( resp: Incident ) => {
			expect( resp.IncidentId ).toEqual( id1 );
		});
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
			error: {}, status: 404, statusText: errMsg
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
	it( 'should handle an error on create...', async(() => {
		//
		console.log( 'handle an error on create...' );
		let mockData: Incident = mockDatum[ 2 ];
		let id1: number = mockData.IncidentId;
		const errMsg = 'Invalid request parameters';
		const mockErrorResponse = {
			status: 404, statusText: 'Bad Request'
		};
		sut.createIncident( mockData ).subscribe((resp) => {
			console.log( 'handleError on create: expected error response:' );
			console.log(  JSON.stringify( resp ) );
			fail( 'handleError: expected error...' );
		}, ( error: string ) => {
			console.log( error );
			expect( error ).toEqual( mockErrorResponse.statusText );
		} );
		const request: TestRequest = backend.expectOne( `${url}/` );
		expect( request.request.method ).toBe( 'POST' );
		request.flush( errMsg, mockErrorResponse );
		//
	}));
	//
});
// ===========================================================================
