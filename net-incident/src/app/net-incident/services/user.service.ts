// ===========================================================================
// File: User.service.ts
// Service for User class
//
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpErrorResponse } from '@angular/common/http';
//
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//
import { Message } from '../../global/message';
import { IUser, User } from '../user';
import { environment } from '../../../environments/environment';
//
@Injectable()
export class UserService {
	//
	url: string;
	logLevel: number;
	public codeName: string;
	//
	// Service constructor, inject http service.
	//
	constructor( private http: HttpClient ) {
		this.url = environment.base_Url + 'User';
		this.codeName = 'User-Service';
		// 1=error, 2=warning, 3=info, 4=verbose
		this.logLevel = environment.logLevel;
	}
	//
	// Single place to create a new User.
	//
	emptyUser( ): IUser {
		return new User(
			'','','','','','','',false,'',false,0,[],'',undefined, []);
	}
	//
	// CRUD (Create/Read/Update/Delete)
	// Get User with UserAccount
	//
	getUser( UserAccount: string ): Observable<IUser> {
		const urlPath: string = this.url + '/' + String( UserAccount );
		if( this.logLevel >= 4 ) {
			console.log( urlPath );
		}
		return this.http.get<IUser>( urlPath )
			.pipe( catchError( this.handleError ) );
	}
	//
	// Get User with UserAccount
	//
	getUserServer( userName: string, serverShortName: string ): Observable<IUser> {
		// <param name="id"></param>
		// <param name="serverShortName"></param>
		const urlPath: string = this.url + '?id=' + userName
			+ '&serverShortName=' + serverShortName;
		if( this.logLevel >= 4 ) {
			console.log( urlPath );
		}
		return this.http.get<IUser>( urlPath )
			.pipe( catchError( this.handleError ) );
	}
	//
	// General error handler
	//
	handleError( error: any ) {
		console.error( 'UserService: ' + error );
		if ( error instanceof HttpErrorResponse ) {
			return throwError( error.statusText || 'Service error' );
		}
		return throwError( error.toString() || 'Service error' );
	}
	//
}
// ===========================================================================
