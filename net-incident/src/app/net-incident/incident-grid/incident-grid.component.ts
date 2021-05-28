// File: incident-grid.component.ts
import { Component, OnInit, OnDestroy, Input, ViewChild, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
//
import { Table } from 'primeng/table';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { FilterMetadata } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
import { BaseCompService } from '../../common/base-comp/base-comp.service';
import { BaseComponent } from '../../common/base-comp/base-comp.component';
import { DetailWindowInput } from '../DetailWindowInput';
import { IUser, User } from '../user';
import { UserService } from '../services/user.service';
import { IncidentService } from '../services/incident.service';
import { IIncident, Incident } from '../incident';
import { IncidentDetailWindowComponent } from '../incident-detail-window/incident-detail-window.component';
import { ServerSelectionWindowComponent } from '../server-selection-window/server-selection-window.component';
import { IncidentPaginationData } from '../incident-pagination-data';
import { AppComponent } from '../../app.component';
//
@Component({
	selector: 'app-incident-grid',
	templateUrl: './incident-grid.component.html',
	styleUrls: ['./incident-grid.component.css']
})
export class IncidentGridComponent extends BaseComponent implements OnInit {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	//
	// Window/dialog communication (also see onClose event)
	windowDisplay: boolean = false;
	selectItemsWindow: SelectItem[] = [];
	displayServersWindow: boolean = false;
	detailWindow: DetailWindowInput | undefined;
	// Local variables
	incidents: Incident[] = [];
	totalRecords: number = 0;
	id: number = -1;
	loading: boolean = false;
	@ViewChild('dt') dt: Table | undefined;
	visible: boolean = true;
	//
	mailed: boolean = false;
	closed: boolean = false;
	special: boolean = false;
	// communicate to the AlertComponent
	protected _alerts: AlertsService;
	// to write console logs condition on environment log-level
	protected _console: ConsoleLogService;
	// PrimeNG's Ok/Cancel confirmation dialog service
	protected _confirmationService: ConfirmationService;
	//
	// --------------------------------------------------------------------
	// Inputs and emitted outputs
	// 	inputs: login user
	// 	outputs: onClose
	//
	@Input() user: User;
	//
	constructor(
		// inject the base components services
		private _baseSrvc: BaseCompService,
		private _data: IncidentService,
		private _user: UserService,
	) {
		super( _baseSrvc );
		// get the needed services from the base component
		this._alerts = _baseSrvc._alerts;
		this._console = _baseSrvc._console;
		this._confirmationService = _baseSrvc._confirmationService;
		this.codeName = 'incident-grid-component';
		//
		this.user = User.empty( );
		this.detailWindow = undefined;
		//
	}
	//
	// On component initialization, get all data from the data service.
	//
	ngOnInit() {
		this._console.Information(
			`${this.codeName}.ngOnInit: Entering ...` );
		this.loading = true;
	}
	//
	// --------------------------------------------------------------------
	// Events:
	// addItemClicked, editItemClicked, deleteItemClicked, onClose
	// Add button clicked, launch edit detail window.
	//
	addItemClicked( ) {
		this._console.Information(
			`${this.codeName}.addItemClicked: Entering ...` );
		this._console.Information( JSON.stringify( this.user ) );
		if( AppComponent.securityManager !== undefined ) {
			if( AppComponent.securityManager.isValidIncidentDetail( ) ) {
				const empty: Incident = this._data.emptyIncident( );
				empty.ServerId = this.user.Server.ServerId;
				this.editItemClicked( empty );
			} else {
				this._alerts.setWhereWhatWarning( this.codeName, 'Not authorized' );
			}
		}		
	}
	//
	// Edit button clicked, launch edit detail window.
	//
	editItemClicked( item: Incident ) {
		//
		if( AppComponent.securityManager !== undefined ) {
			if( AppComponent.securityManager.isValidIncidentDetail( ) ) {
				this.id = item.IncidentId;
				this._console.Information(
					`${this.codeName}.editItemClicked: Entering, id: ${this.id}` );
				this.detailWindow = new DetailWindowInput( this.user, item );
				this.windowDisplay = true;
				this._console.Information(
					`${this.codeName}.editItemClicked: ${this.windowDisplay}` );
			} else {
				this._alerts.setWhereWhatWarning( this.codeName, 'Not authorized' );
			}
		}		
	}
	//
	// Confirm component (delete)
	//
	deleteItemClicked( item: Incident ): boolean {
		if( AppComponent.securityManager !== undefined ) {
			if( AppComponent.securityManager.isValidIncidentDetail( ) ) {
				this.id = item.IncidentId;
				this._console.Information(
					`${this.codeName}.deleteItemClicked: Entering, id: ${this.id}` );
				// the p-confirmDialog in in app.component
				return this.baseDeleteConfirm<number>( this.id, (ident: number): boolean => {
					return this.deleteItem( ident );
				}, '' );
			} else {
				this._alerts.setWhereWhatWarning(
					this.codeName, 'Not authorized' );
			}
		} else {
			this._alerts.setWhereWhatError(
				this.codeName, 'deleteItemClicked', 'securityManager undefined' );
		}
		return false;
	}
	//
	// on edit window closed
	//
	onClose( saved: boolean ) {
		this._console.Information(
			`${this.codeName}.onClose: entering: ${saved}` );
		if( saved === true ) {
			this._console.Information(
				`${this.codeName}.onClose: Refreshing...` );
			this.refreshWithVisibility();
		}
		this.windowDisplay = false;
		this.detailWindow = undefined;
		this.incidents = [ ... this.incidents ];
	}
	//
	// onChangeServer( "server" )
	// Launch server selection window
	//
	onChangeServer( event: any ) {
		this._console.Information(
			`${this.codeName}.onChangeServer: entering: ${event}` );
		this.selectItemsWindow = this.user.ServerShortNames;
		this.displayServersWindow = true;
		this._console.Information(
			`${this.codeName}.onChangeServer: ${event.value}` );
	}
	//
	// onServerSelected($event)
	//
	onServerSelected( event: any ) {
		this.getUserServer( this.user.UserName, event );
		this._console.Information(
			`${this.codeName}.onServerSelected: ${event}` );
	}
	//
	// updateVisibility, refresh by instantly toggling visiblity
	//
	refreshWithVisibility(): void {
		this._console.Information(
			`${this.codeName}.refreshWithVisibility: entered` );
		this.visible = false;
		setTimeout( ( ) => this.visible = true );
	}
	//
	// --------------------------------------------------------------------
	// File access
	// get user with user service
	// getAll & delete
	//
	getUserServer( userName: string, serverShortName: string ) {
		//
		this._console.Information( `${this.codeName}.getUserServer: user: ${userName}, short: ${serverShortName}` );
		this._user.getUserServer( userName, serverShortName )
								.subscribe( ( userData: User ) => {
			this._console.Information(
				`${this.codeName}.authUser: user: ${userData.UserName}` );
			if( userData.ServerShortName !== ''
				&& userData.ServerShortName.toLowerCase()
						=== serverShortName.toLowerCase() ) {
					const changed: boolean = ( userData.ServerShortName.toLowerCase() !== this.user.ServerShortName.toLocaleLowerCase() );
					this.user = userData;
					this.dt.filter( this.user.Server.ServerId, 'ServerId', 'equals' );
					this.displayServersWindow = false;
			} else {
				this._console.Information(
					`${this.codeName}.getUserServer, Returned: ${userData.ServerShortName}` );
				this.selectItemsWindow = this.user.ServerShortNames;
				this.displayServersWindow = true;
			}
		},
		error => this.baseErrorHandler(
			this.codeName, `User not found: ${userName}`, error ));
		//
	}
	//
	// event:
	// {first: 3, rows: 3, sortField: "AbuseEmailAddress", sortOrder: 1,
	// filters: }, globalFilter: null, multiSortMeta: undefined}
	// make a remote request to load data using state metadata from event
	// event.first = First row offset
	// event.rows = Number of rows per page
	// event.sortField = Field name to sort with
	// event.sortOrder = Sort order as number, 1 for asc and -1 for dec
	// filters: FilterMetadata object having field as key and filter value, filter matchMode as value
	//
	loadIncidentsLazy( event: LazyLoadEvent ) {
		setTimeout( ( ) => {
			this.loading = true;
			// manually apply filters, to force the filter.
			event.filters.ServerId = {
				value: this.user.Server.ServerId,
				matchMode: 'equals'
			};
			event.filters.Mailed = {
				value: this.mailed,
				matchMode: 'equals'
			};
			event.filters.Closed = {
				value: this.closed,
				matchMode: 'equals'
			};
			event.filters.Special = {
				value: this.special,
				matchMode: 'equals'
			};
			// const ev: any = { ... event };
			// ev.filters = { 'ServerId':
			// 	[{ value: this.user.Server.ServerId, matchMode: 'equals' }] };
			// ev.filters = { 'Mailed':
			// 	[{ value: this.mailed, matchMode: 'equals' }] };
			// ev.filters = { 'Closed':
			// 	[{ value: this.closed, matchMode: 'equals' }] };
			// ev.filters = { 'Special':
			// 	[{ value: this.special, matchMode: 'equals' }] };
			//
			this._data.getIncidentsLazy( event ).subscribe((incidentPaginationData) => {
				this.loading = false;
				this.incidents = incidentPaginationData.incidents;
				this.totalRecords = incidentPaginationData.totalRecords;
			}, ( error ) => {
				this.loading = false;
				this.baseErrorHandler(
					this.codeName, `loadIncidentsLazy`, error );
			});
		}, 0 );
	}
	//
	// Call delete data service,
	// if successful then delete the row from array
	//
	deleteItem( delId: number ): boolean {
		if( delId !== 0 ) {
			this._data.deleteIncident( delId )
				.subscribe(
					() => {
						this.incidents = this.incidents.filter(function(el) {
							return el.IncidentId !== delId;
							});
						this._alerts.setWhereWhatSuccess(
							'Incident-Grid', 'Deleted:' + delId);
					},
					error => this.baseErrorHandler(
						this.codeName, 'Incident-Grid Delete', error ));
		}
		return false;
	}
	//
}
// End of incident-grid.component.ts
