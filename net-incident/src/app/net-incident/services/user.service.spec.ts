// ===========================================================================
// File: User.service.spec.ts
// Tests of service for: User
//
import { TestBed, getTestBed, inject, waitForAsync } from '@angular/core/testing';
//
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
//
import { environment } from '../../../environments/environment';
import { Message } from '../../global/message';
import { AlertsService } from '../../global/alerts/alerts.service';
import { UserService } from './user.service';
import { IUser, User } from '../user';
import { ServerData } from '../server-data';
import { SelectItemClass } from '../../global/select-item-class';
//
describe('UserService', () => {
	let sut: UserService;
	let http: HttpClient;
	let backend: HttpTestingController;
	const url: string = environment.base_Url + 'User';
	const errMsg: string = 'Fake error';
	const testDate: Date = new Date('2017-01-01T00:00:00');
	const startDate: Date = new Date('2018-03-11T02:00:00');
	const endDate: Date = new Date('2018-11-04T02:00:00');
	const server = new ServerData(
		1, 1, 'NSG', 'Srv 1', 'Members Web-site',
		'Web-site', 'Web-site address: www.nsg.com',
		'We are in Michigan, USA.', 'Phil Huhn', 'Phil', 'PhilHuhn@yahoo.com',
		'EST (UTC-5)', true,  'EDT (UTC-4)', startDate, endDate
	);
	//
	const mockDatum = [
		new User('e0-01','U1','U','N','U N','U','UN1@yahoo.com',true,'734-555-1212',
			true,1, [new SelectItemClass('srv 1','Server 1')],'srv 1',server,[]),
		new User('e0-02','U2','U','N','U N','U','UN2@yahoo.com',true,'734-555-1212',
			true,1, [new SelectItemClass('srv 1','Server 1')],'srv 1',server,[]),
		new User('e0-03','U3','U','N','U N','U','UN3@yahoo.com',true,'734-555-1212',
			true,1, [new SelectItemClass('srv 1','Server 1')],'srv 1',server,[]),
		new User('e0-04','U4','U','N','U N','U','UN4@yahoo.com',true,'734-555-1212',
			true,1, [new SelectItemClass('srv 1','Server 1')],'srv 1',server,[])
	];
	//
	beforeEach( waitForAsync( ( ) => {
		TestBed.configureTestingModule( {
			imports: [
				// no more boilerplate code w/ custom providers needed :-)
				HttpClientModule,
				HttpClientTestingModule
			],
			providers: [
				{ provide: UserService, useClass: UserService },
				{ provide: AlertsService, useClass: AlertsService }
			]
		} );
		sut = getTestBed().get( UserService );
		TestBed.compileComponents();
	} ) );
	//
	beforeEach(
		inject(
			[ HttpClient, HttpTestingController ],
			( httpClient: HttpClient, httpBackend: HttpTestingController ) => {
				http = httpClient;
				backend = httpBackend;
		}
	) );
	//
	// Run HttpTestingController's verify to make sure that there are no
	// outstanding requests.
	//
	afterEach(() => {
		backend.verify();
	});
	//
	it( 'should create ...', ( ) => {
		console.log( '=================================' );
		console.log( 'UserService: should create ...' );
		expect( sut ).toBeTruthy( );
	});
	//
	it( 'should create an empty class ...', ( ) => {
		console.log( 'Should create an empty class ...' );
		const newData: User = sut.emptyUser( );
		expect( newData.Id ).toEqual( '' );
	});
	//
	// getUser( id: string ) : Observable<IUser>
	//
	it( 'should get by id (primary key)...', waitForAsync( ( ) => {
		// Error: Expected one matching request for criteria "Match URL: http://localhost:9111/api/User/", found none.
		const mockData: User = mockDatum[ 1 ];
		const id1: string = mockData.UserName;
		const path: string = url + '/' + id1;
		sut.getUser( id1 ).subscribe( ( data: User ) => {
			// console.log( data );
			expect( data.UserName ).toEqual( id1 );
		});
		// use the HttpTestingController to mock requests and the flush method to provide dummy values as responses
		console.log( path );
		const request = backend.expectOne( path );
		console.log( request.request.method );
		expect( request.request.method ).toBe( 'GET' );
		request.flush( mockData );
		//
	}));
	//
	// getUserServer( id: string ) : Observable<IUser>
	//
	it( 'should get by id and server short name...', waitForAsync( ( ) => {
		//
		const mockData: User = mockDatum[ 1 ];
		const id1: string = mockData.UserName;
		const srv: string = mockData.ServerShortName;
		const path: string = url + '?id=' + id1 + '&serverShortName=' + srv;
		sut.getUserServer( id1, srv ).subscribe( ( data: User ) => {
			expect( data.UserName ).toEqual( id1 );
		});
		// use the HttpTestingController to mock requests and the flush method to provide dummy values as responses
		console.log( path );
		const request = backend.expectOne( path );
		console.log( request.request.method );
		expect( request.request.method ).toBe( 'GET' );
		request.flush( mockData );
		//
	}));
	//
	// handleError( error: any )
	//
	it( 'should throw an error...', waitForAsync(() => {
		//
		sut.handleError( errMsg ).subscribe( () => {
				fail( 'handleError: expected error...' );
			}, ( error ) => {
				expect( error ).toEqual( errMsg );
		} );
		//
	}));
	//
});
// ===========================================================================
