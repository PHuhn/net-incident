// ===========================================================================
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpErrorResponse } from '@angular/common/http';
//
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//
import { Message } from '../../global/message';
import { environment } from '../../../environments/environment';
//
@Injectable()
export class ServicesService {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	// Local variables
	//
	codeName: string = 'services-service';
	logLevel: number = 1;
	// 'http://localhost:9111/api/'
	url: string = environment.base_Url;
	//
	// Service constructor, inject http service.
	//
	constructor( private http: HttpClient ) {
		this.logLevel = environment.logLevel;
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
		if( this.logLevel >= 4 ) {
			console.log( urlPath );
		}
		return this.http.get<string>( urlPath )
			.catch( this.handleError );
	}
	//
	// General error handler
	//
	handleError( error: any ) {
		console.error( 'UserService: ' + error );
		if ( error instanceof HttpErrorResponse ) {
			return Observable.throw( error.statusText || 'Service error' );
		}
		return Observable.throw( error.toString() || 'Service error' );
	}
	//
}
// ===========================================================================
