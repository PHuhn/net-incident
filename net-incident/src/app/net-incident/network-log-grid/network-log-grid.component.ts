// File: networklog-grid.component.ts
import { Component, OnInit, AfterViewInit, OnChanges, Input, Output, ViewChild, EventEmitter, ElementRef, SimpleChanges, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, throwError, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
//
import { DataTable, DataTableModule } from '../../../../node_modules/primeng/components/datatable/datatable';
import { ConfirmDialog } from '../../../../node_modules/primeng/components/confirmdialog/confirmdialog';
import { ConfirmationService } from '../../../../node_modules/primeng/components/common/confirmationservice';
//
import { environment } from '../../../environments/environment';
import { AlertsService } from '../../global/alerts/alerts.service';
import { TruncatePipe } from '../../global/truncate.pipe';
import { INetworkLog, NetworkLog } from '../network-log';
import { IIncident, Incident } from '../incident';
import { NetworkIncident } from '../network-incident';
//
@Component({
	selector: 'app-networklog-grid',
	templateUrl: './network-log-grid.component.html'
})
export class NetworkLogGridComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	// Local variables
	//
	private codeName: string = 'network-log-grid';
	private logLevel: number = 1;
	totalRecords: number = 0;
	// id: number;
	// ip: string;
	@ViewChild(('IpFilter')) fltrEl: ElementRef;
	ipFltr: HTMLInputElement;
	grid: DataTable;
	selectedLogs: NetworkLog[] = [];
	disabled: boolean;
	//
	// --------------------------------------------------------------------
	// Inputs and emitted outputs
	// 	inputs: networklogs: NetworkLog[];
	// 	outputs:
	//
	@Input() networkIncident: NetworkIncident;
	//
	@Output() ipChanged = new EventEmitter<string>();
	//
	constructor(
		private _alerts: AlertsService,
		private _confirmationService: ConfirmationService,
		private _elementRef: ElementRef ) { }
	//
	// On component initialization, set ip address filter.
	//
	ngOnInit() {
		this.logLevel = environment.logLevel;
		if( this.logLevel >= 4 ) {
			console.log ( `${this.codeName}.ngOnInit: entering ...` );
		}
		this.ipFltr = undefined;
		this.selectedLogs = [];
		this.disabled = undefined;
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
	ngOnChanges(changes: SimpleChanges): void {
		if(changes['networkIncident']) {
			if( this.logLevel >= 4 ) {
				console.log ( `${this.codeName}.ngOnChanges: entering ...` );
			}
			if( this.networkIncident !== undefined ) {
				if( this.logLevel >= 4 ) {
					console.log ( this.networkIncident );
				}
				this.afterViewInit( false );
			}
		}
	}
	//
	// After the view is initialized, this will be available.
	//
	ngAfterViewInit() {
		if( this.logLevel >= 4 ) {
			console.log ( `${this.codeName}.ngAfterViewInit: entering...` );
		}
		// ExpressionChangedAfterItHasBeenCheckedError:
		// https://stackoverflow.com/questions/44070732/angular-4-expressionchangedafterithasbeencheckederror-expression-has-changed
		// in Observable val = 0, 1, 2, 3
		// retry every 10th of a second, last time pass true
		// Observable.interval( 100 ).take( 4 ).subscribe( val => {
		let cnt: number = 0;
		//Observable.interval( 100 ).takeWhile( val => cnt < 4 ).subscribe( val => {
		interval( 100 ).pipe(takeWhile(val => cnt < 4)).subscribe(val => {
				cnt++;
			if( this.logLevel >= 4 ) {
				console.log ( `${this.codeName}.ngAfterViewInit: ${val}.` );
			}
			if( this.afterViewInit( cnt === 4 ) === true ) {
				cnt = 4;
			}
		});
	}
	//
	afterViewInit( complete: boolean ): boolean {
		if( this.logLevel >= 4 ) {
			console.log ( `${this.codeName}.afterViewInit: Entering: ${complete} ...` );
		}
		this.ipFltr = this._elementRef.nativeElement.querySelector( '#fltr' );
		if( this.ipFltr === undefined || this.ipFltr === null ) {
			if( this.logLevel >= 4 ) {
				console.log ( `${this.codeName}.afterViewInit: filter element not found.` );
			}
			return false;
		}
		if( this.networkIncident === undefined || this.networkIncident === null ) {
			if( this.logLevel >= 4 ) {
				console.log ( `${this.codeName}.afterViewInit: Network Incident not found.` );
			}
			return false;
		}
		//
		this.disabled = !( this.networkIncident.incident.Mailed === false
			&& this.networkIncident.incident.Closed === false );
		this.viewInitIPAddress( );
		this.applyFilter( this.networkIncident.incident.IPAddress );
		if( this.disabled === true ) {
			if( this.logLevel >= 3 ) {
				console.log ( `${this.codeName}.afterViewInit: Disabled: ${this.disabled}` );
			}
			this.selectedLogs = [];
		}
		if( this.logLevel >= 4 ) {
			console.log ( `${this.codeName}.afterViewInit: returning at: ${new Date().toISOString()}` );
		}
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
			ipAddress  = this.selectedLogs[ 0 ].IPAddress;
		}
		// if ip address changes then set incident and emit the change.
		if( ipAddress !== this.networkIncident.incident.IPAddress ) {
			this.networkIncident.incident.IPAddress = ipAddress;
			this.ipChanged.emit( this.networkIncident.incident.IPAddress );
		}
	}
	//
	// apply the ip address filter.
	//
	applyFilter( ipAddress: string ): void {
		// https://stackoverflow.com/questions/44428535/
		// how-to-preset-programmatically-the-filter-value-in-primeng-datatable
		const event = new Event('input', {
			'bubbles': true,
			'cancelable': true
		});
		(<HTMLInputElement>this.ipFltr).value = ipAddress;
		if( this.logLevel >= 4 ) {
			console.log ( `${this.codeName}.applyFilter: Filter set: ${this.ipFltr.value}` );
		}
		this.fltrEl.nativeElement.dispatchEvent( event );
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
	handleRowSelect( event ) {
		if( this.logLevel >= 4 ) {
			console.log ( `${this.codeName}.handleRowSelect: Entering: ${event} ...` );
			console.log ( event );
		}
		if( !this.disabled ) {
			const ip = event.data.IPAddress;
			if( this.logLevel >= 4 ) {
				console.log( `${this.codeName}.handleRowSelect: entered ip: ${ip}` );
			}
			event.data.Selected = true;
			event.data.IsChanged = true;
			event.data.IncidentId = this.networkIncident.incident.IncidentId;
			if( this.networkIncident.incident.IPAddress === '' ) {
				this.ipChanged.emit( ip ); // needs to call whois
				this.applyFilter( ip );
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
	handleRowUnSelect( event ) {
		if( this.logLevel >= 4 ) {
			console.log ( `${this.codeName}.handleRowUnSelect: Entering: ${event} ...` );
			console.log ( event );
		}
		if( !this.disabled ) {
			if( this.logLevel >= 4 ) {
				console.log ( `${this.codeName}.handleRowUnSelect: not disabled.` );
			}
			event.data.Selected = false;
			event.data.IsChanged = true;
			event.data.IncidentId = null;
			const cnt: number = this.networkIncident.networkLogs.reduce( (previousCnt, currentObject) => {
				return previousCnt + (currentObject.Selected !== false ? 1: 0);
			}, 0);
			if( this.logLevel >= 4 ) {
				console.log ( `${this.codeName}.handleRowUnSelect: count: ${cnt}` );
			}
			if( cnt === 0 ) {
				this.networkIncident.incident.IPAddress = '';
				this.ipChanged.emit( this.networkIncident.incident.IPAddress );
				this.applyFilter( this.networkIncident.incident.IPAddress );
			}
			if( this.logLevel >= 4 ) {
				console.log ( `${this.codeName}.handleRowUnSelect: ip: ${this.networkIncident.incident.IPAddress}` );
			}
		}
	}
	//
	// Rows delete icon clicked, popup a modal confirmation prompt.
	//
	deleteItemClicked( item: NetworkLog ): boolean {
		const delId = item.NetworkLogId;
		if( this.logLevel >= 4 ) {
			console.log( delId );
		}
		// the p-confirmDialog in in app.component
		this._confirmationService.confirm({
			key: 'Delete',
			message: 'Are you sure you want to delete ' + delId + '?',
			accept: () => {
				if( this.logLevel >= 4 ) {
					console.log( `User's response: true` );
				}
				this.deleteItem( delId );
			},
			reject: () => {
				if( this.logLevel >= 4 ) {
					console.log( `User's dismissed.` );
				}
			}
		});
		return false;
	}
	//
	// Rows a delete, move the row from in memory networkLogs to deletedLogs.
	// This still needs to be saved.
	//
	deleteItem( delId: number ): void {
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
					'NetworkLogs-Grid', 'Deleted:' + delId);
			} else {
				this._alerts.setWhereWhatWarning(
					'NetworkLogs-Grid', 'Delete failed for:' + delId);
			}
		}
	}
	//
}
// End of networklog-grid.component.ts
// ===========================================================================
