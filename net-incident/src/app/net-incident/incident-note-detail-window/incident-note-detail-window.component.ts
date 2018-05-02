// ===========================================================================
// File: incident-note-detail-window.component.ts
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
//
import { Dialog } from '../../../../node_modules/primeng/components/dialog/dialog';
import { SelectItem } from '../../../../node_modules/primeng/components/common/selectitem';
import { Dropdown, DropdownModule } from '../../../../node_modules/primeng/components/dropdown/dropdown';
//
import { environment } from '../../../environments/environment';
import { AlertsService } from '../../global/alerts/alerts.service';
import { Message } from '../../global/message';
import { ServicesService } from '../services/services.service';
import { IIncidentNote, IncidentNote } from '../incident-note';
import { NetworkIncident } from '../network-incident';
import { AbuseEmailReport } from '../abuse-email-report';
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
	private logLevel: number = 1;
	private add: boolean = false;
	private id: number = 0;
	private httpSubscription: Subscription;
	model: IncidentNote;
	//private company: number; 
	//
	// --------------------------------------------------------------------
	// Inputs and emitted outputs
	//  inputs: incidentnote and displayWin
	//  outputs: onClose
	//
	@Input() set incidentnote( incidentnote: IncidentNote ) {
		if( incidentnote !== undefined && incidentnote !== null ) {
			this.model = incidentnote;
			this.add = ( this.model.IncidentNoteId < 1 ? true : false );
			this.id = incidentnote.IncidentNoteId;
			//
			if( this.add ) {
				this.model.IsChanged = true;
			}
			if( this.logLevel >= 4 )
				console.log( `${this.codeName}: ${incidentnote.IncidentNoteId}, win: ${this.displayWin}, add: ${this.add}` );
		} else
			if( this.logLevel >= 4 )
				console.log( `${this.codeName}: incident note is undefined` );
	}
	get incidentnote(): IncidentNote { return this.model; }
	@Input() networkIncident: NetworkIncident;
	@Input() displayWin: boolean;
	//
	@Output() onClose = new EventEmitter<boolean>();
	//
	constructor(
		private _alerts: AlertsService,
		private _services: ServicesService
	) { }
	//
	// On component initialization.
	//
	ngOnInit() {
		//
		// 1=error, 2=warning, 3=info, 4=verbose
		this.logLevel = environment.logLevel;
		//
		// this.networkIncident.noteTypes
		// this.networkIncident.incident.IPAddress
		// this.networkIncident		<- email report
		// this.networkIncident.incidentNotes
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}: ngOnInit: ...` );
			console.log( this.networkIncident );
		}
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
		if( this.httpSubscription )
			this.httpSubscription.unsubscribe( );
	}
	//
	// close the window, via 
	//
	windowClose(saved: boolean) {
		if( this.logLevel >= 4 )
			console.log( `${this.codeName}: windowClose: ${saved}` );
		if( saved === false ) {
			this.onClose.emit( saved );
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
			this.onClose.emit( saved );
		}
	}
	//
	// (change)='onTypeIdDropdownChanged( $event )'
	//
	onTypeIdDropdownChanged( selected: number ) {
		if( this.logLevel >= 4 )
			console.log( `${this.codeName}: onTypeIdDropdownChanged: ${selected}` );
		if( selected > 0 ) {
			this.model.NoteTypeId = selected;
			this.model.NoteTypeShortDesc =
				this.networkIncident.noteTypes.find( t => t.value === selected ).label;
			if( this.add ) {
				this.performIncidentType( selected );
			}
		}
	}
	//
	// Perform the function indicated by this incident-type:
	// * Ping this IP-address,
	// * WhoIs this IP-address,
	// * Compose e-mail message for this IP-address.
	//
	performIncidentType( incidentType: number ): void {
		if( incidentType > 0 && incidentType < 4 ) {
			if( incidentType == 1 ) {
				this.getPing( );
			}
			if ( incidentType == 2 ) {
				this.getWhoIs( );
			}
			if ( incidentType == 3 ) {
				this.getReport( );
			}
		}
	}
	//
	// Ping this IP-address
	//
	getPing( ): void {
		if( this.logLevel >= 4 )
			console.log( `${this.codeName}.getPing: Entering, ip: ${this.networkIncident.incident.IPAddress}` );
		this.model.Note = 'This may take 10 seconds...';
		this.httpSubscription = this._services.getPing( this.networkIncident.incident.IPAddress ).subscribe(( pingData: string ) => {
			this.model.Note = ( pingData !== '' ? pingData :
				`-no data for ${this.networkIncident.incident.IPAddress}-` );
		}, ( error ) =>
			this._alerts.setWhereWhatError( 'Note detail: getPing',
				'Services-Service failed.', error || 'Server error'));
	}
	//
	// WhoIs this IP-address
	//
	getWhoIs( ): void {
		if( this.logLevel >= 4 )
			console.log( `${this.codeName}.getWhoIs: Entering, ip: ${this.networkIncident.incident.IPAddress}` );
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
		if( this.logLevel >= 4 )
			console.log( `${this.codeName}.getReport: Entering, ip: ${this.networkIncident.incident.IPAddress}` );
		let abuseReport: AbuseEmailReport = new AbuseEmailReport( this.networkIncident );
		if( abuseReport.IsValid() ) {
			this.model.Note = abuseReport.ComposeEmail( ).replace(/\\n/g, '\n');
		} else {
			if( this.logLevel >= 4 )
				console.error( abuseReport.errMsgs );
			this._alerts.warningSet( abuseReport.errMsgs );
		}
	}
	//
	// Check against a common set of validation rules.
	//
	validate( ) {
		let errMsgs: Message[] = this.validateNote( this.model, this.add );
		//
		if( errMsgs.length > 0 ) {
			console.log( 'Error: ' + errMsgs[0].message );
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
			errMsgs.push( new Message( 'IncidentNoteId-1', "'Incident Note Id' is required." ) );
		}
		if( model.NoteTypeId === undefined || model.NoteTypeId === null || model.NoteTypeId < 1 ) {
			errMsgs.push( new Message( 'NoteTypeId-1', "'Note Type Id' is required." ) );
		}
		if( model.NoteTypeId > 2147483647 ) {
			errMsgs.push( new Message( 'NoteTypeId-2', "'Note Type Id' is too large, over: 2147483647" ) );
		}
		if( model.Note.length === 0 || model.Note === undefined ) {
			errMsgs.push( new Message( 'Note-1', "'Note' is required." ) );
		}
		if( model.Note.length > 1073741823 ) {
			errMsgs.push( new Message( 'Note-2', "'Note' max length of 1073741823." ) );
		}
		//
		return errMsgs;
	}
	//
	// --------------------------------------------------------------------
	// File access
	//  create & update
	//
	// Call create data service,
	// if successful then emit to parent form success.
	//
	createItem( ): void {
		if( this.model.IncidentNoteId === 0 ) {
			if( this.logLevel >= 4 )
				console.log( this.model );
			// give a fake id, -1 is a bad fake id because findIndex can return -1
			this.model.IncidentNoteId = this.newNoteId();
			// this reassignment (spread), tells angular to update view
			this.networkIncident.incidentNotes =
				[...this.networkIncident.incidentNotes, this.model];
		} else {
			const msg = `Id should be 0: ${this.model.IncidentNoteId}`;
			console.error( msg );
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
			let idx = this.networkIncident.incidentNotes.findIndex( n => n.IncidentNoteId  === this.model.IncidentNoteId );
			if( idx !== -1 ) {
				this.model.IsChanged = true;
				this.networkIncident.incidentNotes = this.networkIncident.incidentNotes.map(
					( el ) => el.IncidentNoteId == this.model.IncidentNoteId ? this.model : el );
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
