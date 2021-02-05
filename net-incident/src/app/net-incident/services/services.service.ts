// ===========================================================================
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpErrorResponse } from '@angular/common/http';
//
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//
import { Message } from '../../global/alerts/message';
import { environment } from '../../../environments/environment';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
//
@Injectable( { providedIn: 'root' } )
export class ServicesService {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	// Local variables
	//
	codeName: string = 'services-service';
	url: string;
	//
	// Service constructor, inject http service.
	//
	constructor(
		private http: HttpClient,
		private _console: ConsoleLogService ) {
		// 'http://localhost:9111/api/'
		this.url = environment.base_Url;
	}
	//
	// Get ping for ip address
	//
	getPing( ipAddress: string ): Observable<string> {
		const urlPath: string = `${this.url}services/ping/${ipAddress}`;
		return this.getService( urlPath );
	}
	//
	// Get ping for ip address
	//
	getWhoIs( ipAddress: string ): Observable<string> {
		const urlPath: string = `${this.url}services/whois/${ipAddress}`;
		return this.getService( urlPath );
	}
	//
	// Get service for ip address
	//
	getService( urlPath: string ): Observable<string> {
		this._console.Information(
			`${this.codeName}.getService: ${urlPath}` );
		return this.http.get<string>( urlPath )
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
