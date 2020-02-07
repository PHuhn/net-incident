// File: incidentnote-grid.component.ts
import { Component, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
//
import { SelectItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
//
import { environment } from '../../../environments/environment';
import { AlertsService } from '../../global/alerts/alerts.service';
import { IIncident, Incident } from '../incident';
import { IIncidentNote, IncidentNote } from '../incident-note';
import { NetworkIncident } from '../network-incident';
//
@Component({
	selector: 'app-incident-note-grid',
	templateUrl: './incident-note-grid.component.html'
})
export class IncidentNoteGridComponent implements OnInit, OnDestroy {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	// Window/dialog communication (also see onClose event)
	//
	// Local variables
	private codeName: string = 'Incident-Note-Grid';
	private logLevel: number = 1;
	private totalRecords: number = 0;
	private id: number;
	private disableDelete: boolean = false;
	// xfer to detail window
	windowIncidentNote: IncidentNote = undefined;
	windowDisplay: boolean = false;
	//
	// --------------------------------------------------------------------
	// Inputs and emitted outputs
	// inputs: networklogs: NetworkLog[];
	// outputs:
	//
	@Input() networkIncident: NetworkIncident;
	//
	constructor(
		private _alerts: AlertsService,
		private _confirmationService: ConfirmationService
	) { }
	//
	// On component initialization, get all data from the data service.
	//
	ngOnInit() {
		// 1=error, 2=warning, 3=info, 4=verbose
		this.logLevel = environment.logLevel;
		// all records are passed in via @Input
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName} - ngOnInit: ...` );
		}
		if( this.networkIncident.incident.Mailed === true || this.networkIncident.incident.Closed === true ) {
			this.disableDelete = true;
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
		//
	}
	//
	// --------------------------------------------------------------------
	// Events:
	// addItemClicked, editItemClicked, deleteItemClicked, onClose
	// Add button clicked, launch edit detail window.
	//
	addItemClicked( ) {
		this.windowDisplay = true;
		this.windowIncidentNote = this.emptyIncidentNote( );
		this.id = this.windowIncidentNote.IncidentNoteId;
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.addItemClicked: Add item clicked: ${this.windowDisplay}` );
		}
	}
	//
	emptyIncidentNote( ): IIncidentNote {
		return new IncidentNote(
			0,undefined,'','',new Date( Date.now() ), true
		);
	}
	//
	// Edit button clicked, launch edit detail window.
	//
	editItemClicked( item: IncidentNote ) {
		this.windowIncidentNote = item;
		this.id = item.IncidentNoteId;
		this.windowDisplay = true;
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.editItemClicked: open dialog: ${this.windowDisplay}` );
			console.log( item );
		}
	}
	//
	// Confirm component (delete)
	//
	deleteItemClicked( item: IncidentNote ): boolean {
		this.id = item.IncidentNoteId;
		if( this.disableDelete === true && this.id > -1 ) {
			this._alerts.setWhereWhatWarning(
				this.codeName, `Locked, cannot delete id: ${this.id}`);
			return;
		}
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.deleteItemClicked: Id: ${this.id}` );
		}
		// the p-confirmDialog in in app.component
		this._confirmationService.confirm({
			key: 'Delete',
			message: `Are you sure you want to delete ${this.id}?`,
			accept: () => {
				if( this.logLevel >= 4 ) {
					console.log( `${this.codeName}.deleteItemClicked: User's response: true to delete ${this.id}` );
				}
				this.deleteItem( );
			},
			reject: () => {
				if( this.logLevel >= 4 ) {
					console.log( `${this.codeName}.deleteItemClicked: User's dismissed.` );
				}
			}
		});
		return false;
	}
	//
	// on edit window closed
	//
	onClose( saved: boolean ) {
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.onClose: Entering: on close with: ${saved}` );
		}
		if( saved === true && this.logLevel >= 4 ) {
			console.log( `${this.codeName}.onClose: Refreshing...` );
			console.log( this.networkIncident.incidentNotes );
		}
		this.windowDisplay = false;
		this.windowIncidentNote = undefined;
	}
	//
	// --------------------------------------------------------------------
	// File access
	// delete
	//
	// move row to deleted array
	//
	deleteItem( ): boolean {
		const delId: number = this.id;
		if( this.id !== 0 ) {
			const notes = this.networkIncident.incidentNotes.filter( (el) => {
				return el.IncidentNoteId === delId;
			});
			if( notes.length > 0 ) {
				this.networkIncident.deletedNotes.push( notes[0] );
				this.networkIncident.incidentNotes = this.networkIncident.incidentNotes.filter( (el) => {
					return el.IncidentNoteId !== delId;
				});
				this._alerts.setWhereWhatSuccess(
					this.codeName, `Deleted: ${delId}`);
			} else {
				this._alerts.setWhereWhatWarning(
					this.codeName, `Delete failed for: ${delId}` );
			}
		}
		return false;
	}
	//
}
// End of incidentnote-grid.component.ts
