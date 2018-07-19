// ===========================================================================
// File: auth.service.spec.ts
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
//
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
//
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//
import { Message } from '../../global/message';
import { LoginViewModel } from '../login-view-model';
import { ITokenResponse, TokenResponse } from '../token-response';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
//
describe('AuthService', () => {
	let sut: AuthService;
	let http: HttpClient;
	let backend: HttpTestingController;
	const url: string = environment.base_Url + 'Token';
	beforeEach( async( ( ) => {
		TestBed.configureTestingModule( {
			imports: [
				// HttpClient 4.3 testing
				HttpClientModule,
				HttpClientTestingModule
			],
			providers: [
				AuthService
			]
		} );
		// Setup injected pre service for each test
		http = TestBed.get( HttpClient );
		backend = TestBed.get( HttpTestingController );
		//
		sut = getTestBed().get( AuthService );
		TestBed.compileComponents();
	} ) );
	//
	afterEach( ( ) => {
		// cleanup
		backend.verify();
	});
	//
	function setLocalStorage( token: string, expiresAt: number ) {
		localStorage.setItem( 'access_expires', JSON.stringify( expiresAt.valueOf() ) );
		localStorage.setItem( 'access_token', token );
	}
	//
	function unsetLocalStorage( ) {
		localStorage.removeItem( 'access_token' );
		localStorage.removeItem( 'access_expires' );
	}
	//
	it( 'should be created ...', ( ) => {
		console.log(
			'===================================\n' +
			'AuthService should create ...' );
		expect( sut ).toBeTruthy( );
	});
	// public logout( )
	it( 'should clear local storage when logout ...', ( ) => {
		setLocalStorage( '1234567890', Date.now() + 10000 );
		sut.logout( );
		const token = localStorage.getItem( 'access_token' );
		expect( token ).toBeNull();
		unsetLocalStorage( );
	});
	// public isLoggedIn()
	it( 'should be logged in when local storage set ...', ( ) => {
		setLocalStorage( '1234567890', Date.now() + 10000 );
		const ret: boolean = sut.isLoggedIn( );
		expect( ret ).toBeTruthy( );
		unsetLocalStorage( );
	});
	// public isLoggedIn()
	it( 'should not be logged in when local storage not set ...', ( ) => {
		const ret: boolean = sut.isLoggedIn( );
		expect( ret ).toBeFalsy( );
	});
	// public isLoggedOut()
	it( 'should not be logged out when local storage set ...', ( ) => {
		setLocalStorage( '1234567890', Date.now() + 10000 );
		const ret: boolean = sut.isLoggedOut( );
		expect( ret ).toBeFalsy( );
		unsetLocalStorage( );
	});
	// public isLoggedOut()
	it( 'should be logged out when local storage not set ...', ( ) => {
		const ret: boolean = sut.isLoggedOut( );
		expect( ret ).toBeTruthy( );
	});
	// public getExpiration()
	it( 'should get the expiration that was set ...', ( ) => {
		const expires: number = Date.now() + 10000;
		setLocalStorage( '1234567890', expires );
		const ret: number = sut.getExpiration( );
		expect( ret ).toBe( expires );
		unsetLocalStorage( );
	});
	// public authenticate( userName: string, password: string )
	it( 'should authenticate user name and password ...', ( ) => {
		//
		const userName: string = 'TestUser';
		const token: string = '1234567890';
		const tokenType: string = 'bearer';
		const response: TokenResponse = new TokenResponse(
			token, tokenType, 10000, 'TestUser'
		);
		sut.authenticate( userName, 'asdfdsaf' ).subscribe( ( tokenData: TokenResponse ) => {
			//
			expect( tokenData.access_token ).toEqual( token );
			expect( tokenData.userName ).toEqual( userName );
			expect( tokenData.token_type ).toEqual( tokenType );
			const expire: number = sut.getExpiration( );
			const accessToken: string = localStorage.getItem( 'access_token' );
			console.log( `authenticate returned expire: ${expire}, token: ${accessToken}` );
			expect( expire ).toBeGreaterThan( 10000 );
			expect( accessToken ).toEqual( token );
			unsetLocalStorage( );
			//
		}, error => expect( error ).toBeFalsy( ) );
		const request = backend.expectOne( `${url}` );
		expect( request.request.method ).toBe( 'POST' );
		request.flush( response );
		//
	});
	// public authenticate( userName: string, password: string )
	it( 'should fail authentication with bad user name ...', ( ) => {
		//
		console.log( 'authenticate user name and password ...' );
		const userName: string = 'TestUser';
		const token: string = '1234567890';
		const tokenType: string = 'bearer';
		const response: TokenResponse = new TokenResponse(
			token, tokenType, 10000, userName
		);
		sut.authenticate( 'badUserName', 'asdfdsaf' ).subscribe( ( tokenData: TokenResponse ) => {
			//
			console.log( JSON.stringify( tokenData ) );
			unsetLocalStorage( );
			fail( 'Bad user name should fail.' );
			//
		}, error => {
			console.log( JSON.stringify( error ) );
			expect( String( error ) ).toEqual( 'Error: authenticate: Invalid user name returned.' );
		} );
		const request = backend.expectOne( `${url}` );
		expect( request.request.method ).toBe( 'POST' );
		request.flush( response );
		//
	});
	//
});
// ===========================================================================
