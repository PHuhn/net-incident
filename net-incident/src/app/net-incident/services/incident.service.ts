// ===========================================================================
// File: Incident.service.ts
// Service for Incident class
//
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpErrorResponse } from '@angular/common/http';
//
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//
import { environment } from '../../../environments/environment';
import { Message } from '../../global/message';
import { IIncident, Incident } from '../incident';
//
@Injectable()
export class IncidentService {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	//
	codeName = 'incident-service';
	url: string = environment.base_Url + 'Incident';
	logLevel: number = 1;
	//
	// Service constructor, inject http service.
	//
	constructor( private http: HttpClient ) {
		// 1=error, 2=warning, 3=info, 4=verbose
		this.logLevel = environment.logLevel;
	}
	//
	// Single place to create a new Incident.
	//
	emptyIncident( ): IIncident {
		return new Incident(
			0,0,'','','','','',false,false,false,'',new Date('2000-01-01T00:00:00')
		);
	}
	//
	// CRUD (Create/Read/Update/Delete)
	// Read (get) all Incident
	//
	getIncidents( serverId: number, mailed: boolean, closed: boolean, special: boolean ): Observable<IIncident[]> {
        // /api/Incident/1?mailed=true&closed=true&special=false
		const urlPath: string = this.url + '/' + String(serverId)
			+ '?mailed=' + String(mailed) + '&closed=' + String(closed)
			+ '&special=' + String(special);
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.getIncidents: ${urlPath}` );
		}
		return this.http.get<Array<IIncident>>( urlPath )
			.pipe( catchError( this.handleError ) );
	}
	//
	// Read (get) Incident with id
	//
	getIncident( IncidentId: number ): Observable<IIncident> {
		const urlPath: string = this.url + '/' + String( IncidentId );
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.getIncident: ${urlPath}` );
		}
		return this.http.get<IIncident>( urlPath )
			.pipe( catchError( this.handleError ) );
	}
	//
	// Create (post) Incident
	//
	createIncident( incident: IIncident ) {
		const urlPath: string = this.url + '/';
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.createIncident: ${ JSON.stringify( incident ) }` );
		}
		return this.http.post<IIncident>( urlPath, incident )
			.pipe( catchError( this.handleError ) );
	}
	//
	// Update (put) Incident
	//
	updateIncident( incident: IIncident ) {
		const urlPath: string = this.url + '/' + String( incident.IncidentId );
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.updateIncident: ${urlPath}` );
		}
		return this.http.put<IIncident>( urlPath, incident )
			.pipe( catchError( this.handleError ) );
	}
	//
	// Delete (delete) Incident with id
	//
	deleteIncident( IncidentId: number ) {
		const urlPath: string = this.url + '/' + String( IncidentId );
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.deleteIncident: ${urlPath}` );
		}
		return this.http.delete<IIncident>( urlPath )
			.pipe( catchError( this.handleError ) );
	}
	//
	// General error handler
	//
	handleError( error: any ) {
		if ( error instanceof HttpErrorResponse ) {
			if( this.logLevel >= 4 ) {
				console.error( `${this.codeName}:` );
				console.error( error );
			}
			return throwError( error.statusText || 'Service error' );
		}
		if( this.logLevel >= 4 ) {
			console.error( `${this.codeName}: ${error}` );
		}
		return throwError( error.toString() || 'Service error' );
	}
	//
}
// ===========================================================================
