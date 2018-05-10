// ===========================================================================
// File: User.service.ts
// Service for User class
//
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
//
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//
import { Message } from '../../global/message';
import { LoginViewModel } from '../login-view-model';
import { ITokenResponse, TokenResponse } from '../token-response';
import { environment } from '../../../environments/environment';
//
@Injectable()
export class AuthService {
	//
	private url: string;
	logLevel: number;
	public codeName: string;
	public tokenResponse: ITokenResponse;
	//
	// Service constructor, inject http service.
	//
	public constructor( private http: HttpClient ) {
		// base_Url: 'http://localhost:9111/api/',
		this.url = environment.base_Url + 'Token';
		// 1=error, 2=warning, 3=info, 4=verbose
		this.logLevel = environment.logLevel;
		this.codeName = 'Auth-Service';
	}
	//
	// Get authenticated with UserName and Pasword
	//
	public authenticate( userName: string, password: string ) {
		// configure call to login service
		const body = `grant_type=password&username=${userName}&password=${password}`;
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.authenticate: ${body}` );
		}
		// https://stackoverflow.com/questions/44439562/errorunsupported-grant-type-for-angular-call
		// https://stackoverflow.com/questions/47831291/angular-v5-1-0-httpclient-not-set-header-content-type-application-json
		const options = { headers: new HttpHeaders().set( 'Content-Type', 'application/x-www-form-urlencoded' ) };
		// call to login service
		return this.http.post<ITokenResponse>( this.url, body, options )
			.do( ( tokenResponse: ITokenResponse ) => {
				this.tokenResponse = tokenResponse;
				if( userName === this.tokenResponse.userName
							&& 'bearer' === this.tokenResponse.token_type
							&& this.tokenResponse.expires_in > 0 ) {
					if( this.logLevel >= 4 ) {
						console.log( `${this.codeName}.authenticate: authenticated: ${this.tokenResponse.access_token} ${this.tokenResponse.token_type} ${this.tokenResponse.userName}` );
					}
					// expires_in is # of seconds - 1, Date.now() is # of milliseconds
					const expiresAt = Date.now() + ( this.tokenResponse.expires_in * 1000 ) ;
					localStorage.setItem( 'access_expires', JSON.stringify( expiresAt.valueOf() ) );
					localStorage.setItem( 'access_token', this.tokenResponse.access_token );
				} else {
						console.log( JSON.stringify( this.tokenResponse ) );
						throw new Error( 'authenticate: Invalid user name returned.' );
				}
				return this.tokenResponse;
			} ).catch( this.handleError );
		//
	}
	//
	// Clear all values in local storage
	//
	public logout( ): void {
		localStorage.removeItem( 'access_token' );
		localStorage.removeItem( 'access_expires' );
	}
	//
	public isLoggedIn( ): boolean {
		return ( Date.now() < this.getExpiration() );
	}
	//
	public isLoggedOut( ): boolean {
		return !this.isLoggedIn();
	}
	//
	// get expiration from local storage
	//
	public getExpiration( ): number {
		const expiration = localStorage.getItem( 'access_expires' );
		if ( expiration === null ) {
			return 0;
		}
		const expiresAt: number = JSON.parse(expiration);
		return expiresAt;
	}
	//
	// General error handler
	//
	private handleError( error: any ) {
		console.error( this.codeName + '.handleError: ' + error );
		if ( error instanceof HttpErrorResponse ) {
			return Observable.throw( error.statusText || 'Service error' );
		}
		return Observable.throw( error.toString() || 'Service error' );
	}
	//
}
// ===========================================================================
