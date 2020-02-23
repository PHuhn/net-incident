// ===========================================================================
// File: User.service.ts
// Service for User class
//
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpErrorResponse } from '@angular/common/http';
//
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//
import { Message } from '../../global/message';
import { IUser, User } from '../user';
import { environment } from '../../../environments/environment';
import { ConsoleLogService } from '../../global/console-log.service';
//
//
@Injectable( { providedIn: 'root' } )
export class UserService {
	//
	url: string;
	public codeName: string;
	//
	// Service constructor, inject http service.
	//
	constructor(
		private http: HttpClient,
		private _console: ConsoleLogService
		) {
		this.url = environment.base_Url + 'User';
		this.codeName = 'User-Service';
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
		this._console.Information(
			`${this.codeName}.getUser: ${urlPath}` );
		return this.http.get<IUser>( urlPath )
			.pipe( catchError( this.handleError.bind(this) ) );
	}
	//
	// Get User with UserAccount
	//
	getUserServer( userName: string, serverShortName: string ): Observable<IUser> {
		// <param name="id"></param>
		// <param name="serverShortName"></param>
		const urlPath: string = this.url + '?id=' + userName
			+ '&serverShortName=' + serverShortName;
		this._console.Information(
			`${this.codeName}.getUserServer: ${urlPath}` );
		return this.http.get<IUser>( urlPath )
			.pipe( catchError( this.handleError.bind(this) ) );
	}
	//
	// General error handler
	//
	handleError( error: any ) {
		if ( error instanceof HttpErrorResponse ) {
			this._console.Error(
				`${this.codeName}.handleError: ${ JSON.stringify( error ) }` );
			return throwError( error.statusText || 'Service error' );
		}
		this._console.Error(
			`${this.codeName}.handleError: ${error.toString()}` );
		return throwError( error.toString() || 'Service error' );
	}
	//
}
// ===========================================================================
