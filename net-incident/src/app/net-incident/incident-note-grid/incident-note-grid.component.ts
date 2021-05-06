// File: incidentnote-grid.component.ts
import { Component, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
//
import { SelectItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
//
import { ConsoleLogService } from '../../global/console-log/console-log.service';
import { AlertsService } from '../../global/alerts/alerts.service';
import { BaseCompService } from '../../common/base-comp/base-comp.service';
import { BaseComponent } from '../../common/base-comp/base-comp.component';
import { IIncident, Incident } from '../incident';
import { IIncidentNote, IncidentNote } from '../incident-note';
import { NetworkIncident } from '../network-incident';
import { IIncidentNoteWindowInput } from '../incident-note-detail-window/incident-note-detail-window.component';
//
@Component({
	selector: 'app-incident-note-grid',
	templateUrl: './incident-note-grid.component.html'
})
export class IncidentNoteGridComponent extends BaseComponent implements OnInit, OnDestroy {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	// Window/dialog communication (also see onClose event)
	//
	// Local variables
	private totalRecords: number = 0;
	private id: number;
	private disableDelete: boolean = false;
	// xfer to detail window
	windowIncidentNoteInput: IIncidentNoteWindowInput | undefined;
	// communicate to the AlertComponent
	protected _alerts: AlertsService;
	// to write console logs condition on environment log-level
	protected _console: ConsoleLogService;
	// PrimeNG's Ok/Cancel confirmation dialog service
	protected _confirmationService: ConfirmationService;
	//
	// --------------------------------------------------------------------
	// Inputs and emitted outputs
	// inputs: networklogs: NetworkLog[];
	// outputs:
	//
	@Input() networkIncident: NetworkIncident;
	//
	constructor(
		// inject the base components services
		private _baseSrvc: BaseCompService,
	) {
		super( _baseSrvc );
		// get the needed services from the base component
		this._alerts = _baseSrvc._alerts;
		this._console = _baseSrvc._console;
		this._confirmationService = _baseSrvc._confirmationService;
		this.codeName = 'Incident-Note-Grid';
		//
	}
	//
	// On component initialization, get all data from the data service.
	//
	ngOnInit() {
		// all records are passed in via @Input
		this._console.Information( `${this.codeName}.ngOnInit: ...` );
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
		this.windowIncidentNoteInput = {
			model: this.emptyIncidentNote( ),
			networkIncident: this.networkIncident,
			displayWin: true
		};
		this.id = this.windowIncidentNoteInput.model.IncidentNoteId;
		this._console.Information( `${this.codeName}.addItemClicked: Add item clicked` );
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
		this.id = item.IncidentNoteId;
		this.windowIncidentNoteInput = {
			model: item,
			networkIncident: this.networkIncident,
			displayWin: true
		};
		this._console.Information( `${this.codeName}.editItemClicked: open dialog: ${this.id}` );
		this._console.Information( JSON.stringify( item ) );
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
		this._console.Information( `${this.codeName}.deleteItemClicked: Id: ${this.id}` );
		// the p-confirmDialog in in app.component
		return this.baseDeleteConfirm<number>( this.id, (ident: number): boolean => {
			return this.deleteItem( ident );
		} );
	}
	//
	// on edit window closed
	//
	onClose( saved: boolean ) {
		this._console.Information( `${this.codeName}.onClose: Entering: on close with: ${saved}` );
		if( saved === true ) {
			this._console.Information( `${this.codeName}.onClose: Refreshing...` );
			this._console.Information( JSON.stringify( this.networkIncident.incidentNotes ) );
		}
		this.windowIncidentNoteInput = undefined;
	}
	//
	// --------------------------------------------------------------------
	// File access
	// delete
	//
	// move row to deleted array
	//
	deleteItem( delId: number ): boolean {
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
