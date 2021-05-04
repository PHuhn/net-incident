// ===========================================================================
// File: incident-note-detail-window.component.ts
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
//
import { Dialog } from 'primeng/dialog';
import { SelectItem } from 'primeng/api';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
//
import { ConsoleLogService } from '../../global/console-log/console-log.service';
import { AlertsService } from '../../global/alerts/alerts.service';
import { Message } from '../../global/alerts/message';
import { ServicesService } from '../services/services.service';
import { IIncidentNote, IncidentNote } from '../incident-note';
import { NetworkIncident } from '../network-incident';
import { AbuseEmailReport } from '../abuse-email-report';
import { IIncident } from '../incident';
//
export interface IIncidentNoteWindowInput {
	model: IIncidentNote;
	networkIncident: NetworkIncident;
	displayWin: boolean;
}
//
@Component({
  selector: 'app-incident-note-detail-window',
  templateUrl: './incident-note-detail-window.component.html'
})
export class IncidentNoteDetailWindowComponent implements OnInit, OnDestroy {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	//
	private codeName: string = 'Incident-Note-Detail-Window';
	private httpSubscription: Subscription;
	model: IIncidentNote;
	networkIncident: NetworkIncident;
	add: boolean = false;
	id: number = 0;
	incidentnoteWindowInput: IIncidentNoteWindowInput | undefined;
	displayWin: boolean;
	//
	// --------------------------------------------------------------------
	// Inputs and emitted outputs
	//  inputs: incidentnote and displayWin
	//  outputs: onClose
	//
	@Input() set incidentnote( input: IIncidentNoteWindowInput | undefined ) {
		if( input !== undefined ) {
			this.incidentnoteWindowInput = input;
			this.networkIncident = input.networkIncident;
			this.model = input.model;
			this.id = this.model.IncidentNoteId;
			this.add = ( this.id < 1 ? true : false );
			this.displayWin = input.displayWin;
			if( this.add ) {
				this.model.IsChanged = true;
			}
			this._console.Verbose(
				`${this.codeName}.Input.incidentnote: ${this.id}, win: ${this.displayWin}` );
		} else {
			this.displayWin = false;
		}
	}
	get incidentnote(): IIncidentNoteWindowInput | undefined { return this.incidentnoteWindowInput; }
	//
	@Output() onClose = new EventEmitter<boolean>();
	//
	constructor(
		private _alerts: AlertsService,
		// to write console logs condition on environment log-level
		private _console: ConsoleLogService,
		private _services: ServicesService
	) { }
	//
	// On component initialization.
	//
	ngOnInit() {
		//
		// this.networkIncident.noteTypes
		// this.networkIncident.incident.IPAddress
		// this.networkIncident		<- email report
		// this.networkIncident.incidentNotes
		this._console.Information( `${this.codeName}: ngOnInit: ...` );
		console.log( this.networkIncident );
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
		if( this.httpSubscription ) {
			this.httpSubscription.unsubscribe( );
		}
	}
	//
	// close the window, via
	//
	windowClose(saved: boolean) {
		this._console.Information( `${this.codeName}: windowClose: ${saved}` );
		if( saved === false ) {
			this.onClose.emit( saved );
			this.displayWin = false;
			return;
		}
		if( this.add === false ) {
			this.model.IncidentNoteId = this.id;
		}
		if( this.validate( ) ) {
			if( this.add === true ) {
				this.createItem( );
			} else {
				this.updateItem( );
			}
		}
	}
	//
	// (change)='onTypeIdDropdownChanged( $event )'
	//
	onTypeIdDropdownChanged( selected: number ) {
		this._console.Information( `${this.codeName}: onTypeIdDropdownChanged: ${selected}` );
		if( selected > 0 ) {
			this.model.NoteTypeId = selected;
			this.model.NoteTypeShortDesc =
				this.networkIncident.noteTypes.find( t => t.value === selected ).label;
			if( this.add ) {
				this.performIncidentType( this.model.NoteTypeId, this.model.NoteTypeShortDesc );
			}
		}
	}
	//
	// Perform the function indicated by this incident-type:
	// * Ping this IP-address,
	// * WhoIs this IP-address,
	// * Compose e-mail message for this IP-address.
	//
	performIncidentType( noteType: number, noteDesc: string ): void {
		this._console.Information( `${this.codeName}.performIncidentType: Entering, id: ${noteType}, ${noteDesc}` );
		switch( noteDesc.toLowerCase( ) ) {
			case 'ping': {
				this.getPing( );
				break;
			}
			case 'whois': {
				this.getWhoIs( );
				break;
			}
			case 'isp rpt': {
				this.getReport( );
				break;
			}
			default: {
				this._console.Error( `${this.codeName}.performIncidentType: default: ${noteType}, ${noteDesc}` );
				break;
			}
		}
	}
	//
	// Ping this IP-address
	//
	getPing( ): void {
		this._console.Information( `${this.codeName}.getPing: Entering, ip: ${this.networkIncident.incident.IPAddress}` );
		this.model.Note = 'This may take 10 seconds...';
		this.httpSubscription = this._services.getPing( this.networkIncident.incident.IPAddress ).subscribe(( pingData: string ) => {
			this.model.Note = ( pingData !== '' ? pingData :
				`-no data for ${this.networkIncident.incident.IPAddress}-` );
		}, ( error ) => {
			this._console.Information( `${this.codeName}.getPing: Exiting, error: ${error}` );
			this._alerts.setWhereWhatError( 'Note detail: getPing',
				'Services-Service failed.', error || 'Server error');
		});
	}
	//
	// WhoIs this IP-address
	//
	getWhoIs( ): void {
		this._console.Information( `${this.codeName}.getWhoIs: Entering, ip: ${this.networkIncident.incident.IPAddress}` );
		this.httpSubscription = this._services.getWhoIs( this.networkIncident.incident.IPAddress ).subscribe(( whoisData: string ) => {
			this.model.Note = ( whoisData !== '' ? whoisData :
				`-no data for ${this.networkIncident.incident.IPAddress}-` );
		}, ( error ) =>
			this._alerts.setWhereWhatError( 'Note detail: getWhoIs',
				'Services-Service failed.', error || 'Server error'));
	}
	//
	// Compose e-mail message for this IP-address
	//
	getReport( ): void {
		this._console.Information( `${this.codeName}.getReport: Entering, ip: ${this.networkIncident.incident.IPAddress}` );
		const abuseReport: AbuseEmailReport = new AbuseEmailReport( this.networkIncident );
		if( abuseReport.IsValid() ) {
			this.model.Note = abuseReport.ComposeEmail( ).replace(/\\n/g, '\n');
		} else {
			console.warn( abuseReport.errMsgs );
			this._alerts.warningSet( abuseReport.errMsgs );
		}
	}
	//
	// Check against a common set of validation rules.
	//
	validate( ) {
		const errMsgs: Message[] = this.validateNote( this.model, this.add );
		//
		if( errMsgs.length > 0 ) {
			this._console.Warning( `${this.codeName}.validate: ${errMsgs[0].message}` );
			this._alerts.warningSet( errMsgs );
			return false;
		}
		return true;
	}
	//
	validateNote( model: IIncidentNote, add: boolean ): Message[] {
		let errMsgs: Message[] = [];
		//
		if( model.IncidentNoteId === undefined || model.IncidentNoteId === null ) {
			errMsgs.push( new Message( 'IncidentNoteId-1', `'Incident Note Id' is required.` ) );
		}
		if( model.NoteTypeId === undefined || model.NoteTypeId === null || model.NoteTypeId < 1 ) {
			errMsgs.push( new Message( 'NoteTypeId-1', `'Note Type Id' is required.` ) );
		}
		if( model.NoteTypeId > 2147483647 ) {
			errMsgs.push( new Message( 'NoteTypeId-2', `'Note Type Id' is too large, over: 2147483647` ) );
		}
		if( model.Note.length === 0 || model.Note === undefined ) {
			errMsgs.push( new Message( 'Note-1', `'Note' is required.` ) );
		}
		if( model.Note.length > 1073741823 ) {
			errMsgs.push( new Message( 'Note-2', `'Note' max length of 1073741823.` ) );
		}
		//
		return errMsgs;
	}
	//
	// --------------------------------------------------------------------
	// File access
	// create & update
	//
	// Call create data service,
	// if successful then emit to parent form success.
	//
	createItem( ): void {
		if( this.model.IncidentNoteId === 0 ) {
			this._console.Information( JSON.stringify( this.model ) );
			// give a fake id, -1 is a bad fake id because findIndex can return -1
			this.model.IncidentNoteId = this.newNoteId();
			// this reassignment (spread), tells angular to update view
			this.networkIncident.incidentNotes =
				[...this.networkIncident.incidentNotes, this.model];
			this.onClose.emit( true );
			this.displayWin = false;
		} else {
			const msg = `Id should be 0: ${this.model.IncidentNoteId}`;
			this._console.Error( `${this.codeName}.createItem: ${msg}` );
			this._alerts.setWhereWhatWarning( 'NotesWindow: createItem', msg );
		}
	}
	//
	// a new note id is negative (non-zero), it also needs to be unique
	// so it can be re-editted, additionally -1 is a bad id because
	// findIndex can return -1
	//
	newNoteId(): number {
		let inId = Math.min.apply(Math,this.networkIncident.incidentNotes.map( (n) => n.IncidentNoteId )) - 1;
		if( inId > -2 ) {
			inId = -2;
		}
		return inId;
	}
	//
	// Call update data service,
	// if successful then emit to parent form success.
	//
	updateItem( ): void {
		if( this.model.IncidentNoteId !== 0 ) {
			const idx = this.networkIncident.incidentNotes.findIndex( n => n.IncidentNoteId  === this.model.IncidentNoteId );
			if( idx !== -1 ) {
				this.model.IsChanged = true;
				this.networkIncident.incidentNotes = this.networkIncident.incidentNotes.map(
					( el ) => el.IncidentNoteId === this.model.IncidentNoteId ? this.model : el );
				this.onClose.emit( true );
				this.displayWin = false;
			} else {
				const msg = `Id not found: ${this.model.IncidentNoteId}`;
				console.error( msg );
				this._alerts.setWhereWhatWarning( 'NotesWindow: updateItem', msg );
			}
		} else {
			const msg = `Invalid 'id' found: ${this.model.IncidentNoteId}`;
			console.error( msg );
			this._alerts.setWhereWhatWarning( 'NotesWindow: updateItem', msg );
		}
	}
	//
}
// End of: incident-note-detail-window.component.ts
// ===========================================================================
