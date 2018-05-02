// IncidentTest2Service
// ===========================================================================
// File: Incident.service.ts
// Service for Incident class
//
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpErrorResponse } from '@angular/common/http';
//
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
//
import { Message } from '../../global/message';
import { IIncident, Incident } from '../incident';
import { environment } from '../../../environments/environment';
//
@Injectable()
export class IncidentTest2Service {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	//
	codeName: string;
	logLevel: number;
	url: string;
	//
	// Service constructor, inject http service.
	//
	constructor( private http: HttpClient ) {
		this.codeName = 'incident.service';
		// 1=error, 2=warning, 3=info, 4=verbose
		this.logLevel = environment.logLevel;
		this.url = environment.base_Url + 'Incident';
	}
	//
	// Single place to create a new Incident.
	//
	emptyIncident( ): IIncident {
		return new Incident(
			0,0,'','','','','',false,false,false,'',new Date( '2000-01-01T00:00:00' )
		);
	}
	//
	// Class validation rules.
	//
	validate( model: IIncident, add: boolean ): Message[] {
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
			errMsgs.push( new Message( 'IPAddress-1', "'I P Address' is required." ) );
		}
		if( model.IPAddress.length > 50 ) {
			errMsgs.push( new Message( 'IPAddress-2', "'I P Address' max length of 50." ) );
		}
		if( model.NIC.length === 0 || model.NIC === undefined ) {
			errMsgs.push( new Message( 'NIC_Id-1', "'N I C  Id' is required." ) );
		}
		if( model.NIC.length > 16 ) {
			errMsgs.push( new Message( 'NIC_Id-2', "'N I C  Id' max length of 16." ) );
		}
		if( model.NetworkName.length > 255 ) {
			errMsgs.push( new Message( 'NetworkName-2', "'Network Name' max length of 255." ) );
		}
		if( model.AbuseEmailAddress.length > 255 ) {
			errMsgs.push( new Message( 'AbuseEmailAddress-2', "'Abuse Email Address' max length of 255." ) );
		}
		if( model.ISPTicketNumber.length > 50 ) {
			errMsgs.push( new Message( 'ISPTicketNumber-2', "'I S P Ticket Number' max length of 50." ) );
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
		if( model.CreatedDate === undefined || model.CreatedDate === null ) {
			errMsgs.push( new Message( 'CreatedDate-1', "'Created Date' is required." ) );
		}
		//
		return errMsgs;
	}
	//
	// CRUD (Create/Read/Update/Delete)
	// Read (get) all Incident
	//
	getIncidents( ): Observable<IIncident[]> {
		const urlPath: string = this.url + '/';
		if( this.logLevel >= 4 )
			console.log( `${this.codeName}.getIncidents: ${urlPath}` );
		return this.http.get<Array<IIncident>>( urlPath )
			.catch( this.handleError );
	}
	//
	// Read (get) Incident with id
	//
	getIncident( IncidentId: number ): Observable<IIncident> {
		const urlPath: string = this.url + '/' + String( IncidentId );
		if( this.logLevel >= 4 )
			console.log( `${this.codeName}.getIncidents: ${urlPath}` );
		return this.http.get<IIncident>( urlPath )
			.catch( this.handleError );
	}
	//
	// Create (post) Incident
	//
	createIncident( incident: IIncident ) {
		if( this.logLevel >= 4 )
			console.log( `${this.codeName}.createIncident: ${ JSON.stringify( incident ) }` );
		return this.http.post<IIncident>( this.url, incident )
			.catch( this.handleError );
	}
	//
	// Update (put) Incident
	//
	updateIncident( incident: IIncident ) {
		const urlPath: string = this.url + '/' + String( incident.IncidentId );
		if( this.logLevel >= 4 )
			console.log( `${this.codeName}.updateIncident: ${urlPath}` );
		return this.http.put<IIncident>( urlPath, incident )
			.catch( this.handleError );
	}
	//
	// Delete (delete) Incident with id
	//
	deleteIncident( IncidentId: number ) {
		const urlPath: string = this.url + '/' + String( IncidentId );
		if( this.logLevel >= 4 )
			console.log( `${this.codeName}.deleteIncident: ${urlPath}` );
		return this.http.delete<IIncident>( urlPath )
			.catch( this.handleError );
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
			return Observable.throw( error.statusText || 'Service error' );
		}
		if( this.logLevel >= 4 )
			console.error( `${this.codeName}: ${error}` );
		return Observable.throw( error.toString() || 'Service error' );
	}
	//
}
// ===========================================================================
