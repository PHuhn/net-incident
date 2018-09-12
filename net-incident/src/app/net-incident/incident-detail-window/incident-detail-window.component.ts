// ===========================================================================
// File: Incident-detail-window.component.ts
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs/Rx';
//
import { Dialog } from '../../../../node_modules/primeng/components/dialog/dialog';
import { environment } from '../../../environments/environment';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { ServicesService } from '../services/services.service';
import { NetworkIncidentService } from '../services/network-incident.service';
import { Message } from '../../global/message';
import { DetailWindowInput } from '../DetailWindowInput';
import { IUser, User } from '../user';
import { IIncident, Incident } from '../incident';
import { SelectItemClass } from '../select-item-class';
import { NetworkIncident } from '../network-incident';
import { NetworkIncidentSave } from '../network-incident-save';
import { IWhoIsAbuse, WhoIsAbuse } from '../whois-abuse';
import { IncidentNote } from '../incident-note';
//
import { NetworkLogGridComponent } from '../network-log-grid/network-log-grid.component';
import { IncidentNoteGridComponent } from '../incident-note-grid/incident-note-grid.component';
//
@Component({
	selector: 'app-incident-detail-window',
	templateUrl: './incident-detail-window.component.html'
})
export class IncidentDetailWindowComponent implements OnInit, OnDestroy {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	//
	private codeName: string = 'Incident-Detail-Window';
	private add: boolean = false;
	id: number = -1;
	ip: string = '';
	private serverId: number = -1;
	private userWaitTimeout: any;
	private displayWinTimeout: any;
	private paramsSubscription: Subscription;
	private httpSubscription: Subscription;
	private httpCreateSubscription: Subscription;
	private httpUpdateSubscription: Subscription;
	private detailWindow: DetailWindowInput;
	networkIncident: NetworkIncident;
	networkIncidentSave: NetworkIncidentSave;
	user: User;
	displayWindow: boolean;
	logLevel: number = 1;
	//
	// --------------------------------------------------------------------
	// Inputs and emitted outputs
	// 	inputs: incident and displayWin
	// 	outputs: onClose
	//
	// setter/getter for incident & user
	@Input() set detailWindowInput( detailInput: DetailWindowInput ) {
		this.detailWindow = detailInput;
		if( detailInput === undefined ) {
			this.id = 0;
			return;
		}
		this.user = detailInput.user;
		this.serverId = this.user.Server.ServerId;
		this.id = detailInput.incident.IncidentId;
		this.ip = detailInput.incident.IPAddress;
		this.add = ( detailInput.incident.IncidentId < 1 ? true : false );
		this.networkIncident = undefined;
		this.getNetIncident( this.id, this.serverId );
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}: Editing: ${this.id}, win: ${this.displayWin}` );
		}
	}
	get detailWindowInput(): DetailWindowInput { return this.detailWindow; }
	// setter/getter for displayWin
	@Input() set displayWin( displayWin: boolean ) {
		if( displayWin === true ) {
			this.displayWinTimeout = setTimeout(() => {
				if( this.logLevel >= 4 ) {
					console.log( `${this.codeName}: displayWin: ${displayWin}` );
				}
				// The set displayWindow in getNetIncidents should activate the window
				// this set of displayWindow is the last resort
				this.displayWindow = displayWin;
			},800);
		} else {
			this.displayWindow = displayWin;
		}
	}
	get displayWin(): boolean { return this.displayWindow; }
	//
	@Output() onClose = new EventEmitter<boolean>();
	windowClose(saved: boolean) {
		if( saved === false ) {
			this.onClose.emit( saved ); // cancel
			return;
		}
		//
		this.networkIncidentSave = new NetworkIncidentSave();
		this.networkIncidentSave.incident = this.networkIncident.incident;
		this.networkIncidentSave.incidentNotes =
			this.networkIncident.incidentNotes.filter( nl => nl.IsChanged === true );
		this.networkIncidentSave.deletedNotes = this.networkIncident.deletedNotes;
		this.networkIncidentSave.networkLogs =
			this.networkIncident.networkLogs.filter( nl => nl.IsChanged === true ||
				nl.Selected === true );
		this.networkIncidentSave.deletedLogs = this.networkIncident.deletedLogs;
		this.networkIncidentSave.user = this.networkIncident.user;
		this.networkIncidentSave.message = this.networkIncident.message;
		//
		if( this.logLevel >= 4 ) {
			console.log( this.networkIncidentSave );
		}
		if( this.add === false ) {
			this.networkIncident.incident.IncidentId = this.id;
		}
		if( this.validate( ) ) {
			if( this.add === true ) {
				this.createItem( );
			} else {
				this.updateItem( );
			}
		}
		//
	}
	//
	// Constructor used to inject services.
	//
	constructor(
		private _alerts: AlertsService,
		private _netIncident: NetworkIncidentService,
		private _services: ServicesService ) { }
	//
	// On component initialization.
	//
	ngOnInit() {
		// 1=error, 2=warning, 3=info, 4=verbose
		this.logLevel = environment.logLevel;
	}
	//
	// Cleanup
	// * Stop interval timers (clearTimeout/clearInterval).
	// * Unsubscribe Observables.
	// * Detach event handlers (addEventListener > removeEventListener).
	// * Free resources that will not be garbage collected automatically.
	// * Unregister all callbacks.
	//
	ngOnDestroy() {
		if( this.displayWinTimeout ) {
			clearTimeout( this.displayWinTimeout );
		}
		if( this.userWaitTimeout ) {
			clearTimeout( this.userWaitTimeout );
		}
		if( this.httpSubscription ) {
			this.httpSubscription.unsubscribe( );
		}
		if( this.httpCreateSubscription ) {
			this.httpCreateSubscription.unsubscribe( );
		}
		if( this.httpUpdateSubscription ) {
			this.httpUpdateSubscription.unsubscribe( );
		}
	}
	//
	// get the complete requested incident (unit-of-work).
	//
	getNetIncident( incidentId: number, serverId: number ): void {
		this.httpSubscription = this._netIncident.getNetworkIncident( incidentId, serverId ).subscribe((netIncidentData) => {
			this.networkIncident = netIncidentData;
			this.networkIncident.user = this.user;
			if( this.logLevel >= 4 ) {
				console.log( `${this.codeName}.getNetIncident, ${new Date().toISOString()}` );
				console.log ( this.networkIncident );
			}
			// once the data is loaded now display it.
			this.displayWindow = true;
			clearTimeout( this.displayWinTimeout );
			if( this.logLevel >= 4 ) {
				console.log( `${this.codeName}.getNetIncident, cleared time-out` );
			}
		}, ( error ) =>
			this.serviceErrorHandler(
				`${this.codeName}: Get Network Incident`, error ));
	}
	//
	// Check against a common set of validation rules.
	//
	validate( ): boolean {
		console.log ( this.networkIncidentSave );
		this.initialize( this.networkIncidentSave.incident );
		let errMsgs: Message[] = this._netIncident.validateIncident(
			this.networkIncidentSave.incident, this.add );
		// need at least one log selected
		this._netIncident.validateNetworkLogs( errMsgs, this.networkIncidentSave.networkLogs );
		this.validateUser( errMsgs, this.networkIncidentSave.user );
		//
		if( errMsgs.length > 0 ) {
			console.error( errMsgs );
			this._alerts.warningSet( errMsgs );
			return false;
		}
		return true;
	}
	//
	initialize( model: IIncident ) {
		if( model.IPAddress === undefined || model.IPAddress === null ) {
			model.IPAddress = '';
		}
		if( model.NIC === undefined || model.NIC === null ) {
			model.NIC = '';
		}
		if( model.NetworkName === undefined || model.NetworkName === null ) {
			model.NetworkName = '';
		}
		if( model.AbuseEmailAddress === undefined || model.AbuseEmailAddress === null ) {
			model.AbuseEmailAddress = '';
		}
		if( model.ISPTicketNumber === undefined || model.ISPTicketNumber === null ) {
			model.ISPTicketNumber = '';
		}
		if( model.Notes === undefined || model.Notes === null ) {
			model.Notes = '';
		}
	}
	//
	// Class validation rules.
	//
	validateUser( errMsgs: Message[], model: IUser ): void {
		//
		// from user
		if( this.networkIncident.user.UserName === '' || this.networkIncident.user.UserName === undefined ) {
			errMsgs.push( new Message( 'UserName-1', `From User, 'User Name' is required.` ) );
		}
		if( this.networkIncident.user.UserNicName === '' || this.networkIncident.user.UserNicName === undefined ) {
			errMsgs.push( new Message( 'UserNicName-1', `From User, 'User Nic Name' is required.` ) );
		}
		if( this.networkIncident.user.Email === '' || this.networkIncident.user.Email === undefined ) {
			errMsgs.push( new Message( 'Email-1', `From User, 'User Email Address' is required.` ) );
		}
		//
	}
	//
	// --------------------------------------------------------------------
	// (ipChanged)='ipChanged($event)'
	// get whois data for the ip-address and parse it for:
	// * nic,
	// * network-name,
	// * abuse e-mail address.
	// Update the incident record with this information.  If the abuse
	// e-mail address is not found or invalid then save the whois data to
	// the notes.
	//
	ipChanged( ipAddress: string ): void {
		if( this.logLevel >= 4 ) {
			console.log(
				`${this.codeName}.ipChanged, IP address: ${ipAddress}` );
		}
		if( this.networkIncident.incident.IPAddress !== ipAddress ) {
			this.networkIncident.incident.IPAddress = ipAddress;
			this.ip = ipAddress;
			if( ipAddress === '' ) { return; }
			if( this.logLevel >= 4 ) {
				console.log( `${this.codeName}.ipChanged: calling whois with ${ipAddress}` );
			}
			this._services.getWhoIs( ipAddress ).subscribe(( whoisData: string ) => {
				if( whoisData !== '' ) {
					// instanciate WhoIsAbuse class
					const whois: WhoIsAbuse = new WhoIsAbuse();
					whois.GetWhoIsAbuse( whoisData );
					const cnt: number = this.networkIncident.NICs.reduce( (count, el) => {
						return count + (el.value === whois.nic ? 1 : 0); }, 0 );
					if( cnt > 0 ) {
						this.networkIncident.incident.NIC = whois.nic;
					} else {
						this.networkIncident.incident.NIC = 'other';
					}
					this.networkIncident.incident.AbuseEmailAddress = whois.abuse;
					this.networkIncident.incident.NetworkName = whois.net;
					if( this.logLevel >= 4 ) {
						console.log( `${this.codeName}.ipChanged: WhoIs: ${ipAddress}, ${whois.nic}, ${whois.net}, ${whois.abuse}` );
					}
					if( whois.BadAbuseEmail( ) ) {
						const newNote: IncidentNote = new IncidentNote(
							this.newNoteId(),2,'WhoIs',whoisData,new Date( Date.now() ), true );
						this.networkIncident.incidentNotes = [ ...this.networkIncident.incidentNotes, newNote ];
					}
				} else {
					this._alerts.setWhereWhatError( `${this.codeName}: getWhoIs`,
						'Services-Service failed.', 'Returned no data' );
				}
			}, ( error ) =>
				this._alerts.setWhereWhatError( `${this.codeName}: getWhoIs`,
					'Services-Service failed.', error || 'Server error'));
		} else {
			if( this.logLevel >= 4 ) {
				console.log( `${this.codeName}.ipChanged: Addresses are the same ${this.networkIncident.incident.IPAddress}` );
			}
		}
	}
	//
	// a new note id needs to be -2 or less
	//
	newNoteId(): number {
		let inId = Math.min.apply(Math,this.networkIncident.incidentNotes.map( (n) => n.IncidentNoteId )) - 1;
		if( inId > -2 ) {
			inId = -2;
		}
		return inId;
	}
	//
	// --------------------------------------------------------------------
	// File access
	// create, update & serviceErrorHandler
	//
	// Call create data service,
	// if successful then emit to parent form success.
	//
	createItem( ): void {
		this._netIncident.createIncident( this.networkIncidentSave )
			.subscribe(
				() => {
					this._alerts.setWhereWhatSuccess(
						this.codeName,
						'Created:' + this.networkIncidentSave.incident.IncidentId);
					this.networkIncidentSave = undefined;
					this.onClose.emit( true );
				},
				error => this.serviceErrorHandler(
					`${this.codeName} Create`, error ));
	}
	//
	// Call update data service,
	// if successful then emit to parent form success.
	//
	updateItem( ): void {
		this._netIncident.updateIncident( this.networkIncidentSave )
			.subscribe(
				() => {
					this._alerts.setWhereWhatSuccess(
						this.codeName,
						'Updated:' + this.networkIncidentSave.incident.IncidentId);
					this.networkIncidentSave = undefined;
					this.onClose.emit( true );
				},
				error => this.serviceErrorHandler(
					`${this.codeName} Update`, error ));
	}
	//
	// Handle an error from the data service.
	//
	serviceErrorHandler( where: string, error: string ) {
		console.error( error );
		this._alerts.setWhereWhatError( where,
			'Incident-Service failed.',
			error || 'Server error');
	}
	//
}
// End of: Incident-detail-window.component.ts
// ===========================================================================
