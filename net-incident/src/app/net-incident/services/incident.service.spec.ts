// ===========================================================================
// File: Incident.service.spec.ts
// Tests of service for: Incident
//
import { TestBed, getTestBed, inject, waitForAsync } from '@angular/core/testing';
//
import { HttpClientModule, HttpClient, HttpErrorResponse, HttpRequest, HttpResponseBase } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
//
import { LazyLoadEvent } from 'primeng/api';
//
import { environment } from '../../../environments/environment';
import { Message } from '../../global/alerts/message';
// import { AlertsService } from '../../global/alerts/alerts.service';
import { IncidentService } from './incident.service';
import { IIncident, Incident } from '../incident';
import { IncidentPaginationData } from '../incident-pagination-data';
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
		new Incident( 5,2,'192.5','ripe.net','nn4','a@4.com','',false,false,false,'i 4',testDate ),
		new Incident( 6,1,'192.6','arin.net','nn3','a@3.com','',true,true,true,'i 3',testDate ),
		new Incident( 7,1,'192.7','arin.net','nn3','a@3.com','',true,true,true,'i 3',testDate ),
		new Incident( 8,1,'192.8','arin.net','nn3','a@3.com','',true,true,true,'i 3',testDate ),
		new Incident( 9,1,'192.9','arin.net','nn3','a@3.com','',true,true,true,'i 3',testDate )
	];
	//
	beforeEach( waitForAsync( ( ) => {
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
		const newData: Incident = sut.emptyIncident( );
		expect( newData.IncidentId ).toEqual( 0 );
	});
	//
	// getIncidents( ) : Observable<IIncident[]>
	//
	it( 'should get all IIncident results...', waitForAsync( ( ) => {
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
	// getIncidentsLazy( ) : Observable<IIncident[]>
	//
	it( 'should get page of IIncident results...', waitForAsync( ( ) => {
		//
		const event: LazyLoadEvent = {};
		const srvId: number = 1;
		event.first = 0;
		event.rows = 4;
		event.filters = {};
		event.filters.ServerId = {
			value: srvId,
			matchMode: 'equals'
		};
		event.filters.Mailed = {
			value: true,
			matchMode: 'equals'
		};
		sut.getIncidentsLazy( event ).subscribe( ( datum: IncidentPaginationData ) => {
			expect( datum.incidents.length ).toBe( 4 );
			expect( datum.totalRecords ).toBe( mockDatum.length );
			expect( datum.incidents[ 1 ].IncidentId ).toEqual( 2 );
			expect( datum.incidents[ 3 ].IncidentId ).toEqual( 4 );
		});
		const request = backend.expectOne( url + '?' + JSON.stringify( event ) );
		expect( request.request.method ).toBe( 'GET' );
		const page = new IncidentPaginationData( );
		page.incidents = mockDatum.slice(0, 4);
		page.totalRecords = mockDatum.length;
		page.loadEvent = event;
		request.flush( page );
		//
	}));
	//
	// createIncident( Incident: IIncident )
	//
	it( 'should create a new row...', waitForAsync( ( ) => {
		//
		const mockData: Incident = mockDatum[ 2 ];
		const id1: number = mockData.IncidentId;
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
	it( 'should update Incident row...', waitForAsync( ( ) => {
		//
		const mockData: Incident = mockDatum[ 2 ];
		const id1: number = mockData.IncidentId;
		sut.updateIncident( mockData ).subscribe(( resp: Incident ) => {
			expect( resp.IncidentId ).toEqual( id1 );
		});
		const request: TestRequest = backend.expectOne( `${url}/${id1}` );
		expect( request.request.method ).toBe( 'PUT' );
		request.flush( mockData );
		//
	} ) );
	//
	// deleteIncident( IncidentId: string )
	// 204 says explicitly that you do not include a response body
	//
	it( 'should delete Incident row...', waitForAsync( ( ) => {
		//
		const mockData: Incident = mockDatum[ 2 ];
		const id1: number = mockData.IncidentId;
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
	it( 'handleError should throw an any error ...', waitForAsync( ( ) => {
		//
		const resp: string = errMsg;
		//
		sut.handleError( resp ).subscribe( () => {
				fail( 'handleError: expected error...' );
			}, ( error ) => {
				expect( error ).toEqual( errMsg );
		} );
		//
	} ) );
	//
	// handleError( error: any )
	//
	it( 'handleError should throw a HttpErrorResponse error...', waitForAsync( ( ) => {
		//
		const resp: HttpErrorResponse = new HttpErrorResponse({
			error: {}, status: 404, statusText: errMsg
		});
		//
		sut.handleError( resp ).subscribe( () => {
				fail( 'handleError: expected error...' );
			}, ( error ) => {
				expect( error ).toEqual( errMsg );
		} );
		//
	} ) );
	//
	// handleError( error: any )
	//
	it( 'handleError should handle a string error...', waitForAsync( ( ) => {
		//
		const resp: string = errMsg;
		//
		sut.handleError( resp ).subscribe( () => {
				fail( 'handleError: expected error...' );
			}, ( error ) => {
				expect( error ).toEqual( errMsg );
		} );
		//
	} ) );
	//
	// handle a create error
	//
	it( 'should handle an error on create...', waitForAsync(() => {
		//
		const mockData: Incident = mockDatum[ 2 ];
		const id1: number = mockData.IncidentId;
		const errorMsg = { errorMessage: 'Invalid request parameters' };
		const mockErrorResponse: HttpErrorResponse = new HttpErrorResponse({
			error: {}, status: 500, url: 'http://localhost', statusText: 'Bad Request' });
		sut.createIncident( mockData ).subscribe((resp) => {
			console.log( 'handleError on create: expected error response:' );
			console.log( JSON.stringify( resp ) );
			fail( 'handleError: expected error...' );
		}, ( error ) => {
			expect( error ).toEqual( mockErrorResponse.statusText );
		} );
		const request: TestRequest = backend.expectOne( `${url}/` );
		expect( request.request.method ).toBe( 'POST' );
		// https://github.com/alisaduncan/tutorial-angular-httpclient/blob/master/src/app/user.service.spec.ts#L89
		request.flush(errMsg, mockErrorResponse );
		//
	}));
	//
});
// ===========================================================================
