// ===========================================================================
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
//
import { NetworkIncidentService } from '../../../net-incident/services/network-incident.service';
import { Message } from '../../../global/message';
import { SelectItemClass } from '../../../net-incident/select-item-class';
import { NetworkIncident } from '../../../net-incident/network-incident';
import { NetworkIncidentSave } from '../../../net-incident/network-incident-save';
import { IIncident, Incident } from '../../../net-incident/incident';
import { INetworkLog, NetworkLog } from '../../../net-incident/network-log';
//
export class NetworkIncidentServiceMock  extends NetworkIncidentService {
	//
	public mockCrudResponse: any;
	public mockGet: NetworkIncident;
	public mockCrud: NetworkIncidentSave;
	//
	constructor( ) {
		super(null);
		this.codeName = 'network-incident-service-mock';
	}
	//
	// Get an incident unit of work
	//
	getNetworkIncident( incidentId: number, serverId: number ): Observable<NetworkIncident> {
		const urlPath: string = this.url + '?id=' + String( incidentId )
			+ '&serverId=' + String(serverId);
		console.log( `**ni mock: ${urlPath}  ${new Date().toISOString()}` );
		return of( this.mockGet );
	}
	//
	// Create (post) NetworkIncident
	//
	createIncident( networkIncidentSave: NetworkIncidentSave ) {
		this.mockCrud = networkIncidentSave;
		return this.handleResponse( this.mockCrudResponse );
	}
	//
	// Update (put) NetworkIncident
	//
	updateIncident( networkIncidentSave: NetworkIncidentSave ) {
		const urlPath: string = this.url + '/' + String( networkIncidentSave.incident.IncidentId );
		this.mockCrud = networkIncidentSave;
		return this.handleResponse( this.mockCrudResponse );
	}
	//
	handleResponse( response: any ): any {
		return of( response );
	}
	//
}
// ===========================================================================
