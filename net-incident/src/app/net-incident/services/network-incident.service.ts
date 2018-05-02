import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
//
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//
import { environment } from '../../../environments/environment';
import { Message } from '../../global/message';
import { SelectItemClass } from '../select-item-class';
import { NetworkIncident } from '../network-incident'
import { NetworkIncidentSave } from '../network-incident-save'
import { IIncident, Incident } from '../incident';
import { INetworkLog, NetworkLog } from '../network-log';
//
@Injectable()
export class NetworkIncidentService {
	//
	codeName = 'network-incident-service';
	logLevel: number = 1;
	url: string = environment.base_Url + 'NetworkIncident';
	//
	// Service constructor, inject http service.
	//
	constructor( private http: HttpClient ) {
		// 1=error, 2=warning, 3=info, 4=verbose
		this.logLevel = environment.logLevel;
	}
	//
	// Class validation rules.
	//
	validateIncident( model: IIncident, add: boolean ): Message[] {
		let errMsgs: Message[] = [];
		//
		if( model.IncidentId === undefined || model.IncidentId === null ) {
			errMsgs.push( new Message( 'IncidentId-1', "'Incident Id' is required." ) );
		}
		if( model.ServerId === undefined || model.ServerId === null ) {
			errMsgs.push( new Message( 'ServerId-1', "'Server Id' is required." ) );
		}
		if( model.ServerId > 2147483647 ) {
			errMsgs.push( new Message( 'ServerId-2', "'Server Id' is too large, over: 2147483647" ) );
		}
		if( model.IPAddress.length === 0 || model.IPAddress === undefined ) {
			errMsgs.push( new Message( 'IPAddress-1', "'IP Address' is required." ) );
		}
		if( model.IPAddress.length > 50 ) {
			errMsgs.push( new Message( 'IPAddress-2', "'IP Address' max length of 50." ) );
		}
		if( model.NIC.length === 0 || model.NIC === undefined ) {
			errMsgs.push( new Message( 'NIC-1', "'NIC' is required." ) );
		}
		if( model.NIC.length > 50 ) {
			errMsgs.push( new Message( 'NIC-2', "'NIC' max length of 50." ) );
		}
		if( model.NetworkName.length > 255 ) {
			errMsgs.push( new Message( 'NetworkName-2', "'Network Name' max length of 255." ) );
		}
		if( model.AbuseEmailAddress.length > 255 ) {
			errMsgs.push( new Message( 'AbuseEmailAddress-2', "'Abuse Email Address' max length of 255." ) );
		}
		if( model.ISPTicketNumber.length > 50 ) {
			errMsgs.push( new Message( 'ISPTicketNumber-2', "'ISP Ticket Number' max length of 50." ) );
		}
		if( model.Mailed === undefined || model.Mailed === null ) {
			errMsgs.push( new Message( 'Mailed-1', "'Mailed' is required." ) );
		}
		if( model.Closed === undefined || model.Closed === null ) {
			errMsgs.push( new Message( 'Closed-1', "'Closed' is required." ) );
		}
		if( model.Special === undefined || model.Special === null ) {
			errMsgs.push( new Message( 'Special-1', "'Special' is required." ) );
		}
		if( model.Notes.length > 1073741823 ) {
			errMsgs.push( new Message( 'Notes-2', "'Notes' max length of 1073741823." ) );
		}
		//
		return errMsgs;
	}
	//
	// Class validation rules.
	//
	validateNetworkLog( model: INetworkLog, add: boolean, incidentTypes: SelectItemClass[] ): Message[] {
		let errMsgs: Message[] = [];
		//
		if( model.NetworkLogId === undefined || model.NetworkLogId === null ) {
			errMsgs.push( new Message( 'NetworkLogId-1', "'Network Log Id' is required." ) );
		}
		if( model.ServerId === undefined || model.ServerId === null ) {
			errMsgs.push( new Message( 'ServerId-1', "'Server Id' is required." ) );
		}
		if( model.ServerId > 2147483647 ) {
			errMsgs.push( new Message( 'ServerId-2', "'Server Id' is too large, over: 2147483647" ) );
		}
		if( model.IPAddress.length === 0 || model.IPAddress === undefined ) {
			errMsgs.push( new Message( 'IPAddress-1', "'IP Address' is required." ) );
		}
		if( model.IPAddress.length > 50 ) {
			errMsgs.push( new Message( 'IPAddress-2', "'IP Address' max length of 50." ) );
		}
		if( model.NetworkLogDate === undefined || model.NetworkLogDate === null ) {
			errMsgs.push( new Message( 'NetworkLogDate-1', "'Network Log Date' is required." ) );
		}
		if( model.Log.length === 0 || model.Log === undefined ) {
			errMsgs.push( new Message( 'Log-1', "'Log' is required." ) );
		}
		if( model.Log.length > 1073741823 ) {
			errMsgs.push( new Message( 'Log-2', "'Log' max length of 1073741823." ) );
		}
		if( model.IncidentTypeId === undefined || model.IncidentTypeId === null ) {
			errMsgs.push( new Message( 'IncidentTypeId-1', "'Log Type Id' is required." ) );
		}
		let types = incidentTypes.filter( (el) => {
			return el.value !== model.IncidentTypeId;
		});
		if( types.length === 0 ) {
			errMsgs.push( new Message( 'IncidentTypeId-2', "'Log Type' is not found." ) );
		}
		//
		return errMsgs;
	}
	//
	// Class validation rules.
	//
	validateNetworkLogs( errMsgs: Message[], model: INetworkLog[] ): void {
		//
		let cnt: number = model.reduce( (count, el) => { 
			return count + (el.Selected === true ? 1 : 0); }, 0 );
		if( cnt === 0 ) {
			errMsgs.push( new Message( 'NetworkLog-1', "'Network Log' at least one needs to be selected." ) );
		}
		//
	}
	// api/NetworkIncident/1?serverId=1
	//
	// Get an incident unit of work
	//
	getNetworkIncident( incidentId: number, serverId: number ): Observable<NetworkIncident> {
		const urlPath: string = this.url + '?id=' + String( incidentId )
			+ '&serverId=' + String(serverId);
		console.log( urlPath );
		return this.http.get<NetworkIncident>( urlPath )
			.catch( this.handleError );
	}
	//
	// Create (post) NetworkIncident
	//
	createIncident( networkIncidentSave: NetworkIncidentSave ) {
		console.log( networkIncidentSave );
		return this.http.post<NetworkIncidentSave>( this.url, networkIncidentSave )
			.catch( (err: any) => this.handleError( err ) );
	}
	//
	// Update (put) NetworkIncident
	//
	updateIncident( networkIncidentSave: NetworkIncidentSave ) {
		const urlPath: string = this.url + '/' + String( networkIncidentSave.incident.IncidentId );
		// console.log( urlPath );
		return this.http.put<NetworkIncidentSave>( urlPath, networkIncidentSave )
			.catch( (err: any) => this.handleError( err ) );
	}
	//
	// General error handler
	//
	handleError( error: any ) {
		if ( error instanceof HttpErrorResponse ) {
			console.error( `${this.codeName}:` );
			console.error( error );
			return Observable.throw( error.statusText || 'Service error' );
		}
		if( this.logLevel >= 4 )
			console.error( `${this.codeName}: ${error}` );
		return Observable.throw( error.toString() || 'Service error' );
	}
	//
}
// ===========================================================================
