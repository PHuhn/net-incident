// File: networklog-grid.component.ts
// New incident:
// This component displays all unassigned logs for new incidents, the user can delete
// the log for whatever reason, but it will not actually be deleted until the incident
// is saved.  When a log is selected the grid is filtered, by that IP address (an
// incident can only be from one source IP address).  The selected IP address is
// emitted (output) for any subscribers of the observable.
// Mailed:
// Incidents that are more or less locked, so the selection and delete columns
// are hidden.  That result in more or less colspan for expansion display.
//
import { Component, OnInit, AfterContentInit, OnChanges, Input, Output, ViewChild, EventEmitter, ElementRef, SimpleChanges, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, throwError, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
//
import { Table, TableModule } from 'primeng/table';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
//
import { ConsoleLogService } from '../../global/console-log/console-log.service';
import { AlertsService } from '../../global/alerts/alerts.service';
import { BaseCompService } from '../../common/base-comp/base-comp.service';
import { BaseComponent } from '../../common/base-comp/base-comp.component';
import { TruncatePipe } from '../../global/truncate.pipe';
import { INetworkLog, NetworkLog } from '../network-log';
import { IIncident, Incident } from '../incident';
import { NetworkIncident } from '../network-incident';
//
@Component({
	selector: 'app-networklog-grid',
	templateUrl: './network-log-grid.component.html'
})
export class NetworkLogGridComponent extends BaseComponent implements OnInit, AfterContentInit, OnChanges {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	// Local variables
	//
	@ViewChild('dt', { static: true }) dt: Table | undefined;
	selectedLogs: NetworkLog[] = [];
	disabled: boolean = true;
	expansionColSpan: number = 5;
	// communicate to the AlertComponent
	protected _alerts: AlertsService;
	// to write console logs condition on environment log-level
	protected _console: ConsoleLogService;
	// PrimeNG's Ok/Cancel confirmation dialog service
	protected _confirmationService: ConfirmationService;
	//
	// --------------------------------------------------------------------
	// Inputs and emitted outputs
	// 	inputs: networklogs: NetworkLog[];
	// 	outputs: emitted IP address string
	//
	@Input() networkIncident: NetworkIncident;
	//
	@Output() ipChanged = new EventEmitter<string>();
	//
	constructor(
		// inject the base components services
		private _baseSrvc: BaseCompService,
		private _elementRef: ElementRef
	) {
		super( _baseSrvc );
		// get the needed services from the base component
		this._alerts = _baseSrvc._alerts;
		this._console = _baseSrvc._console;
		this._confirmationService = _baseSrvc._confirmationService;
		this.codeName = 'network-log-grid';
		//
		this.networkIncident = new NetworkIncident( );
	}
	//
	// On component initialization, set ip address filter.
	//
	ngOnInit() {
		this._console.Information( `${this.codeName}.ngOnInit: entering ...` );
		this.selectedLogs = [];
		this.disabled = true;
	}
	//
	// Cleanup
	// * Stop interval timers (clearTimeout/clearInterval).
	// * Unsubscribe Observables.
	// * Detach event handlers (addEventListener > removeEventListener).
	// * Free resources that will not be garbage collected automatically.
	// * Unregister all callbacks.
	// ngOnDestroy() { }
	//
	ngOnChanges(changes: SimpleChanges): void {
		if(changes['networkIncident']) {
				this._console.Information( `${this.codeName}.ngOnChanges: entering ...` );
			if( this.networkIncident !== undefined ) {
				this._console.Debug( JSON.stringify( this.networkIncident ) );
				this.afterViewInit( false );
			}
		}
	}
	//
	// After the view is initialized, this will be available.
	//
	ngAfterContentInit() {
		this._console.Information( `${this.codeName}.ngAfterContentInit: entering...` );
		if( this.networkIncident.incident.IPAddress !== '' ) {
			this.setTableFilter( this.networkIncident.incident.IPAddress );
			this._console.Information( `${this.codeName}.ngAfterContentInit: global filtered...` );
		}
		// ExpressionChangedAfterItHasBeenCheckedError:
		// https://stackoverflow.com/questions/44070732/angular-4-expressionchangedafterithasbeencheckederror-expression-has-changed
		// in Observable val = 0, 1, 2, 3
		// retry every 10th of a second, last time pass true
		// Observable.interval( 100 ).takeWhile( val => cnt < 4 ).subscribe( val => {
		setTimeout( ( ) => {
			this._console.Information( `${this.codeName}.ngAfterContentInit:` );
			if( this.afterViewInit( true ) === false ) {
				let cnt: number = 0;
				interval( 100 ).pipe(takeWhile(val => cnt < 3)).subscribe(val => {
					cnt++;
					this._console.Information( `${this.codeName}.ngAfterContentInit: ${val}.` );
					if( this.afterViewInit( cnt === 3 ) === true ) {
						cnt = 3; // terminate the loop
					}
				});
			} else {
				this._console.Information( `${this.codeName}.ngAfterContentInit: afterInit configured.` );
			}
		}, 0 );
	}
	//
	afterViewInit( complete: boolean ): boolean {
		this._console.Information( `${this.codeName}.afterViewInit: Entering: ${complete} ...` );
		if( this.networkIncident === undefined || this.networkIncident === null ) {
			this._console.Error( `${this.codeName}.afterViewInit: Network Incident not found.` );
			return false;
		}
		//
		this.disabled = !( this.networkIncident.incident.Mailed === false
			&& this.networkIncident.incident.Closed === false );
		this.viewInitIPAddress( );
		this.setTableFilter( this.networkIncident.incident.IPAddress );
		if( this.disabled === true ) {
			this._console.Information( `${this.codeName}.afterViewInit: Disabled: ${this.disabled}` );
			this.selectedLogs = [];
			this.expansionColSpan = 5;
		} else {
			this.expansionColSpan = 7;
		}
		this._console.Information( `${this.codeName}.afterViewInit: returning at: ${new Date().toISOString()}` );
		return true;
	}
	//
	// sync ip address with value of selected log row.
	//
	viewInitIPAddress( ): void {
		let ipAddress: string = '';
		this.selectedLogs = this.networkIncident.networkLogs.filter( (el) => {
			return el.Selected === true;
		});
		if( this.selectedLogs.length > 0 ) {
			ipAddress = this.selectedLogs[ 0 ].IPAddress;
		}
		// if ip address changes then set incident and emit the change.
		if( ipAddress !== this.networkIncident.incident.IPAddress ) {
			this.networkIncident.incident.IPAddress = ipAddress;
			this.ipChanged.emit( this.networkIncident.incident.IPAddress );
		}
	}
	//
	// Set the ip address filter for the p-table.
	//
	setTableFilter( ipAddress: string ): void {
		if( this.dt !== undefined ) {
			this.dt.filterGlobal( ipAddress, 'contains' );
		}
		this._console.Information( `${this.codeName}.setTableFilter: global filtered with ${ipAddress}` );
	}
	//
	// --------------------------------------------------------------------
	// Events:
	// handleRowSelect
	// handleRowUnSelect
	// Confirm component (delete)
	//
	// selection column checked this row.
	//
	handleRowSelect( event: any ) {
		this._console.Information( `${this.codeName}.handleRowSelect: Entering: ${event} ...` );
		this._console.Information( JSON.stringify( event ) );
		if( !this.disabled ) {
			const ip = event.data.IPAddress;
			this._console.Information( `${this.codeName}.handleRowSelect: entered ip: ${ip}` );
			event.data.Selected = true;
			event.data.IsChanged = true;
			event.data.IncidentId = this.networkIncident.incident.IncidentId;
			if( this.networkIncident.incident.IPAddress === '' ) {
				this.ipChanged.emit( ip ); // needs to call whois
				this.setTableFilter( ip );
				this.networkIncident.networkLogs.forEach( (row) => {
					if( row.IPAddress === ip && row.Selected === false ) {
						row.Selected = true;
						row.IsChanged = true;
						row.IncidentId = this.networkIncident.incident.IncidentId;
						this.selectedLogs.push( row );
					}
				});
			}
		}
	}
	//
	// selection column un-checked this row.
	//
	handleRowUnSelect( event: any ) {
		this._console.Information( `${this.codeName}.handleRowUnSelect: Entering: ${event} ...` );
		this._console.Information( JSON.stringify( event ) );
		if( !this.disabled ) {
			this._console.Information( `${this.codeName}.handleRowUnSelect: not disabled.` );
			event.data.Selected = false;
			event.data.IsChanged = true;
			event.data.IncidentId = null;
			const cnt: number = this.networkIncident.networkLogs.reduce( (previousCnt, currentObject) => {
				return previousCnt + (currentObject.Selected !== false ? 1: 0);
			}, 0);
			this._console.Information( `${this.codeName}.handleRowUnSelect: count: ${cnt}` );
			if( cnt === 0 ) {
				this.networkIncident.incident.IPAddress = '';
				this.ipChanged.emit( this.networkIncident.incident.IPAddress );
				this.setTableFilter( this.networkIncident.incident.IPAddress );
			}
			this._console.Information( `${this.codeName}.handleRowUnSelect: ip: ${this.networkIncident.incident.IPAddress}` );
		}
	}
	//
	// Rows delete icon clicked, popup a modal confirmation prompt.
	//
	deleteItemClicked( item: NetworkLog ): boolean {
		const delId = item.NetworkLogId;
		this._console.Information( `${this.codeName}.deleteItemClicked: del id: ${delId}` );
		// the p-confirmDialog in in app.component
		return this.baseDeleteConfirm<number>( delId, (ident: number): boolean => {
			return this.deleteItem( ident );
		} );
	}
	//
	// Rows a delete, move the row from in memory networkLogs to deletedLogs.
	// This still needs to be saved.
	//
	deleteItem( delId: number ): boolean {
		this._console.Information( `${this.codeName}.deleteItem: Entering, del id: ${delId}` );
		if( delId !== 0 ) {
			const logs = this.networkIncident.networkLogs.filter( (el) => {
				return el.NetworkLogId === delId;
			});
			if( logs.length > 0 ) {
				this.networkIncident.deletedLogs.push( logs[0] );
				this.networkIncident.networkLogs = this.networkIncident.networkLogs.filter( (el) => {
					return el.NetworkLogId !== delId;
				});
				this._alerts.setWhereWhatSuccess(
					'NetworkLogs-Grid', `Deleted: ${delId}`);
				this._console.Information( JSON.stringify( this.networkIncident.deletedLogs ) );
			} else {
				this._alerts.setWhereWhatWarning(
					'NetworkLogs-Grid', `Delete failed for: ${delId}`);
			}
		}
		this._console.Information( `${this.codeName}.deleteItem: Exiting, del id: ${delId}` );
		return true;
	}
	//
}
// End of networklog-grid.component.ts
// ===========================================================================
