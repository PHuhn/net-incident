// ===========================================================================
// File: IncidentService.mock.ts
//
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
//
import { IncidentService } from '../../../net-incident/services/incident.service';
import { IIncident, Incident } from '../../../net-incident/incident';
//
export class IncidentServiceMock extends IncidentService {
	//
	public mockGetAll: IIncident[];
	public mockGet: Incident;
	public mockCrud: Incident;
	public mockDeleteId: number;
    public mockCrudResponse: any;
	//
	// Service constructor
	//
	constructor( ) {
		super(null);
		this.codeName = 'Incident-Service-Mock';
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
		return Observable.of( this.mockGetAll );
	}
	//
	// Read (get) Incident with id
	//
	getIncident( IncidentId: number ): Observable<IIncident> {
		const urlPath: string = this.url + '/' + String( IncidentId );
		return Observable.of( this.mockGet );
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
			return Observable.of( response );
		}
        return this.handleError( response );
    }
	//
}
// ===========================================================================
