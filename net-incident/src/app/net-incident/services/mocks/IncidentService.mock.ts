// ===========================================================================
// File: IncidentService.mock.ts
//
import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
//
import { LazyLoadEvent } from 'primeng/api';
import { FilterMetadata } from 'primeng/api';
//
import { IncidentService } from '../../../net-incident/services/incident.service';
import { IIncident, Incident } from '../../../net-incident/incident';
import { IncidentPaginationData } from '../../incident-pagination-data';
import { LazyLoadingMock } from './LazyLoading.mock';
import { ConsoleLogService } from '../../../global/console-log.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
//
@Injectable( { providedIn: 'root' } )
export class IncidentServiceMock extends IncidentService {
	//
	public mockGetAll: IIncident[];
	public mockGet: Incident;
	public mockCrud: Incident;
	public mockDeleteId: number;
	public mockCrudResponse: any;
	lazyLoading: LazyLoadingMock;
	//
	// Service constructor
	//
	constructor(
		_console: ConsoleLogService
		) {
		super(null, _console);
		this.codeName = 'Incident-Service-Mock';
		this.lazyLoading = new LazyLoadingMock();
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
		return of( this.mockGetAll );
	}
	//
	// Read (get) page of Incidents, that are filtered and sorted.
	//
	getIncidentsLazy( event: LazyLoadEvent ): Observable<IncidentPaginationData> {
		// /api/Incident?{"first":0,"rows":3,"filters":{"ServerId":{"value":1,"matchMode":"equals"}}}
		const urlPath: string = this.url + '?' + JSON.stringify( event );
		if( event.sortField === undefined ) {
			event.sortField = 'IncidentId';
			event.sortOrder = -1;
		}
		const page = new IncidentPaginationData( );
		page.totalRecords = this.mockGetAll.length;
		page.incidents = this.lazyLoading.LazyLoading( this.mockGetAll, event );
		page.loadEvent = event;
		console.log( `~=* ${this.codeName}.getIncidentsLazy: ${new Date().toISOString()}` );
		return of( page );
	}
	//
	// Read (get) Incident with id
	//
	getIncident( IncidentId: number ): Observable<IIncident> {
		const urlPath: string = this.url + '/' + String( IncidentId );
		return of( this.mockGet );
	}
	//
	// Create (post) Incident
	//
	createIncident( incident: IIncident ) {
		this.mockCrud = incident;
		return this.handleResponse( this.mockCrudResponse );
	}
	//
	// Update (put) Incident
	//
	updateIncident( incident: IIncident ) {
		const urlPath: string = this.url + '/' + String( incident.IncidentId );
		this.mockCrud = incident;
		return this.handleResponse( this.mockCrudResponse );
	}
	//
	// Delete (delete) Incident with id
	//
	deleteIncident( IncidentId: number ) {
		const urlPath: string = this.url + '/' + String( IncidentId );
		this.mockDeleteId = IncidentId;
		return this.handleResponse( this.mockCrudResponse );
	}
	//
	handleResponse( response: any ): any {
		if ( response instanceof HttpResponse ) {
			return of( response );
		}
		return this.handleError( response );
	}
	//
}
// ===========================================================================
