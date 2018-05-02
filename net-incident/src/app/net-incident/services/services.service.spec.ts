// ===========================================================================
// File: services.service.spec.ts
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
//
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
//
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//
import { Message } from '../../global/message';
import { environment } from '../../../environments/environment';
import { ServicesService } from './services.service';
//
describe('ServicesService', () => {
	let sut: ServicesService;
	let baseUrl: string = environment.base_Url;
	let http: HttpClient;
	let backend: HttpTestingController;
	//
	beforeEach( async( ( ) => {
		TestBed.configureTestingModule( {
			imports: [
				// no more boilerplate code w/ custom providers needed :-)
				HttpClientModule,
				HttpClientTestingModule
			],
			providers: [
				{ provide: ServicesService, useClass: ServicesService }
			]
		} );
		//backend = getTestBed( ).get( MockBackend );
		sut = getTestBed().get( ServicesService );
		TestBed.compileComponents();
	} ) );
	//
	beforeEach(
		inject(
			[HttpClient, HttpTestingController],
			(httpClient: HttpClient, httpBackend: HttpTestingController) => {
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
	it('should be created ...', ( ) => {
		console.log(
			'=================================\n' +
			'ServicesService: should create ...' );
		expect(sut).toBeTruthy();
	} );
	//
	// getPing( ipAddress: string ): Observable<string>
	//
	it( 'should get ping results...', async( ( ) => {
		//
		const ipAddress = '192.168.0.0';
		const pingUrl: string = `${baseUrl}services/ping/${ipAddress}`;
		http.get( pingUrl );
		sut.getPing( ipAddress ).subscribe( ( datum ) => {
			// console.log( datum );
			expect( datum ).toBe( ipAddress );
		});
		// use the HttpTestingController to mock requests and the flush method to provide dummy values as responses
		const request = backend.expectOne( pingUrl );
		expect( request.request.method ).toBe( 'GET' );
		request.flush(ipAddress);
		//
	}));
	//
	// getWhoIs( ipAddress: string ): Observable<string>
	//
	it( 'should get whois results...', async( ( ) => {
		//
		const ipAddress = '192.168.0.1';
		sut.getWhoIs( ipAddress ).subscribe( ( datum ) => {
			expect( datum ).toBe( ipAddress );
		});
		// use the HttpTestingController to mock requests and the flush method to provide dummy values as responses
		// use expectOne(), expectNone() and match() 
		const request = backend.expectOne( `${baseUrl}services/whois/${ipAddress}` );
		expect( request.request.method ).toBe( 'GET' );
		request.flush(ipAddress);
		//
	}));
	//
	// handleError( error: any )
	// 
	it( 'should throw a response error...', async(() => {
		//
		let errMsg: string = 'Fake error';
		let resp: Response = new Response( new ResponseOptions({ 
			body: { error: `${errMsg}` }, status: 599, statusText: `${errMsg}`, url: 'http://localhost'
		}));;
		//
		sut.handleError( resp ).subscribe( () => {
				fail( 'handleError: expected error...' );
			}, ( error ) => {
				expect( error ).toEqual( 'Response with status: 599 Fake error for URL: http://localhost' );
		} );
		//
	}));
	//
	// handleError( error: any )
	// 
	it( 'should throw a string error...', async(() => {
		//
		let errMsg: string = 'Fake error';
		//
		sut.handleError( errMsg ).subscribe( () => {
				fail( 'handleError: expected error...' );
			}, ( error ) => {
				expect( error ).toEqual( errMsg );
		} );
		//
	}));
	//
	// getWhoIs( ipAddress: string ): Observable<string>
	//
	it( 'should handle a whois error results...', async( ( ) => {
		//
		const ipAddress = '192.168.0.1';
		let errMsg: string = 'Fake error';
		//
		sut.getWhoIs( ipAddress ).subscribe( ( datum ) => {
			console.log( datum );
			// expect( datum ).toBe( resp.json( ) );
			expect( datum ).toBe( errMsg );
		});
		// use the HttpTestingController to mock requests and the flush method to provide dummy values as responses
		const request = backend.expectOne( `${baseUrl}services/whois/${ipAddress}` );
		expect( request.request.method ).toBe( 'GET' );
		request.flush( errMsg );
		//
	}));
  	//
});
// ===========================================================================
