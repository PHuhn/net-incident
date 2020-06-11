// ===========================================================================
// File: Incident.service.ts
// Service for Incident class
//
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpErrorResponse } from '@angular/common/http';
//
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LazyLoadEvent } from 'primeng/api';
//
import { environment } from '../../../environments/environment';
import { Message } from '../../global/message';
import { IIncident, Incident } from '../incident';
import { IncidentPaginationData } from '../incident-pagination-data';
import { ConsoleLogService } from '../../global/console-log.service';
//
@Injectable( { providedIn: 'root' } )
export class IncidentService {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	//
	codeName: string;
	url: string;
	//
	// Service constructor, inject http service.
	//
	constructor(
		private http: HttpClient,
		private _console: ConsoleLogService ) {
			this.codeName = 'incident-service';
			this.url = environment.base_Url + 'Incident';
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
		this._console.Information(
			`${this.codeName}.getIncidents: ${urlPath}` );
		return this.http.get<Array<IIncident>>( urlPath )
			.pipe( catchError( this.handleError.bind(this) ) );
	}
	//
	// Read (get) page of Incidents, that are filtered and sorted.
	//
	getIncidentsLazy( event: LazyLoadEvent ): Observable<IncidentPaginationData> {
		// /api/Incident?{"first":0,"rows":3,"filters":{"ServerId":{"value":1,"matchMode":"equals"}}}
		const urlPath: string = this.url + '?' + JSON.stringify( event );
		this._console.Information(
			`${this.codeName}.getIncidentsLazy: ${urlPath}` );
		return this.http.get<IncidentPaginationData>( urlPath )
			.pipe( catchError( this.handleError.bind(this) ) );
	}
	//
	// Create (post) Incident
	//
	createIncident( incident: IIncident ) {
		const urlPath: string = this.url + '/';
		this._console.Information(
			`${this.codeName}.createIncident: ${ JSON.stringify( incident ) }` );
		return this.http.post<IIncident>( urlPath, incident )
			.pipe( catchError( this.handleError.bind(this) ) );
	}
	//
	// Update (put) Incident
	//
	updateIncident( incident: IIncident ) {
		const urlPath: string = this.url + '/' + String( incident.IncidentId );
		this._console.Information( `${this.codeName}.updateIncident: ${urlPath}` );
		return this.http.put<IIncident>( urlPath, incident )
			.pipe( catchError( this.handleError.bind(this) ) );
	}
	//
	// Delete (delete) Incident with id
	//
	deleteIncident( IncidentId: number ) {
		const urlPath: string = this.url + '/' + String( IncidentId );
		this._console.Information(
			`${this.codeName}.deleteIncident: ${urlPath}` );
		return this.http.delete<IIncident>( urlPath )
			.pipe( catchError( this.handleError.bind(this) ) );
	}
	//
	// General error handler
	//
	handleError( error: any ) {
		// not this._console because of testing errors
		if ( error instanceof HttpErrorResponse ) {
			this._console.Error(
				`${this.codeName}.handleError: ${JSON.stringify(error)}` );
			return throwError( error.statusText || 'Service error' );
		}
		this._console.Error(
			`${this.codeName}.handleError: ${error.toString()}` );
		return throwError( error.toString() || 'Service error' );
	}
	//
}
// ===========================================================================
