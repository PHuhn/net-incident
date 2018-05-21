// ===========================================================================
// https://blog.angular-university.io/angular-jwt-authentication/
// https://stackoverflow.com/questions/46225164/unit-testing-httpinterceptor-from-angular-4
import { TestBed, inject } from '@angular/core/testing';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
//
import { Observable, throwError } from 'rxjs';
//
import { environment } from '../../../environments/environment';
import { AuthInterceptorService } from './auth-interceptor.service';
//
describe('AuthInterceptorService', () => {
  //
  const url = environment.base_Url + 'Fake';
  let http: HttpTestingController;
  let httpClient: HttpClient;
  //
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        // Http,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true,
        },
      ],
    });
    http = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
  });
	//
	beforeEach( inject( [ HttpClient, HttpTestingController ],
    ( clientMock: HttpClient, httpMock: HttpTestingController ) => {
      httpClient = clientMock;
      http = httpMock;
    }
  ) );
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
  it('should not have an Authorization header if no token ...', () => {
		console.log(
			'===================================\n' +
			'AuthInterceptorService starting ...' );
    httpClient.get( url ).subscribe(response => {
      console.log( JSON.stringify( response ) );
      expect( response ).toBeTruthy();
    });
    const httpRequest = http.expectOne( url );
    expect( httpRequest.request.headers.get( 'Authorization' ) ).toBeFalsy( );
  });
  //
  it('should add an Authorization header ...', () => {
		setLocalStorage( '1234567890', Date.now() + 10000 );
    httpClient.get( url ).subscribe(response => {
      console.log( JSON.stringify( response ) );
      expect( response ).toBeTruthy();
    });
    const httpRequest = http.expectOne( url );
    expect( httpRequest.request.headers.getAll.length ).toBe( 1 );
    expect( httpRequest.request.headers.has( 'Authorization' ) );
		unsetLocalStorage( );
  });
  //
  it('should add an Authorization header 2 ...', ( ) => {
    const token: string = '1234567890';
		setLocalStorage( '1234567890', Date.now() + 10000 );
    httpClient.get( url ).subscribe(response => {
      console.log( JSON.stringify( response ) );
      expect( response ).toBeTruthy();
    });
    const httpRequest = http.expectOne( url );
    expect(httpRequest.request.headers.get('Authorization')).toBe(
       'Bearer ' + token );
		unsetLocalStorage( );
		console.log(
			'End of auth-interceptor.service\n' +
      '===================================' );
  });
  //
});
// ===========================================================================
