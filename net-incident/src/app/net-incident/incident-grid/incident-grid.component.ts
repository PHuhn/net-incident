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
import { environment } from '../../../environments/environment';
import { AlertsService } from '../../global/alerts/alerts.service';
import { DetailWindowInput } from '../DetailWindowInput';
import { IUser, User } from '../user';
import { UserService } from '../services/user.service';
import { IncidentService } from '../services/incident.service';
import { IIncident, Incident } from '../incident';
import { IncidentDetailWindowComponent } from '../incident-detail-window/incident-detail-window.component';
import { ServerSelectionWindowComponent } from '../server-selection-window/server-selection-window.component';
import { IncidentPaginationData } from '../incidentpaginationdata';
import { AppComponent } from '../../app.component';
//
@Component({
	selector: 'app-incident-grid',
	templateUrl: './incident-grid.component.html',
	styleUrls: ['./incident-grid.component.css']
})
export class IncidentGridComponent implements OnInit, OnDestroy {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	//
	codeName = 'incident-grid-component';
	logLevel: number = 1;
	// Window/dialog communication (also see onClose event)
	windowIncident: Incident = undefined;
	windowDisplay: boolean = false;
	selectItemsWindow: SelectItem[];
	displayServersWindow: boolean = false;
	detailWindow: DetailWindowInput;
	// Local variables
	incidents: Incident[];
	totalRecords: number = 0;
	id: number;
	loading: boolean;
	@ViewChild('dt') dt: Table;
	visible: boolean = true;
	//
	mailed: boolean = false;
	closed: boolean = false;
	special: boolean = false;
	//
	// --------------------------------------------------------------------
	// Inputs and emitted outputs
	// 	inputs: login user
	// 	outputs: onClose
	//
	@Input() user: User;
	//
	constructor(
		private _alerts: AlertsService,
		private _data: IncidentService,
		private _user: UserService,
		private _confirmationService: ConfirmationService ) { }
	//
	// On component initialization, get all data from the data service.
	//
	ngOnInit() {
		// 1=error, 2=warning, 3=info, 4=verbose
		this.logLevel = environment.logLevel;
		this.loading = true;
	}
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
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.addItemClicked:` );
		}
		const empty: Incident = this._data.emptyIncident( );
		empty.ServerId = this.user.Server.ServerId;
		this.editItemClicked( empty );
	}
	//
	// Edit button clicked, launch edit detail window.
	//
	editItemClicked( item: Incident ) {
		//
		if( AppComponent.securityManager.isValidIncidentDetail( ) ) {
			this.id = item.IncidentId;
			this.detailWindow = new DetailWindowInput( this.user, item );
			this.windowDisplay = true;
			if( this.logLevel >= 4 ) {
				console.log( item );
				console.log( `${this.codeName}.editItemClicked: ${this.windowDisplay}` );
			}
		} else {
			this._alerts.setWhereWhatWarning( this.codeName, 'Not authorized' );
		}
	}
	//
	// Confirm component (delete)
	//
	deleteItemClicked( item: Incident ): boolean {
		if( AppComponent.securityManager.isValidIncidentDetail( ) ) {
			this.id = item.IncidentId;
			if( this.logLevel >= 4 ) {
				console.log( `${this.codeName}.deleteItemClicked: ${this.id}` );
			}
			// the p-confirmDialog in in app.component
			this._confirmationService.confirm({
				key: 'Delete',
				message: 'Are you sure you want to delete incident id: ' + this.id + '?',
				accept: () => {
					if( this.logLevel >= 4 ) {
						console.log( `User's response: true` );
					}
					this.deleteItem( );
				},
				reject: () => {
					if( this.logLevel >= 4 ) {
						console.log( `User's dismissed.` );
					}
				}
			});
		} else {
			this._alerts.setWhereWhatWarning( this.codeName, 'Not authorized' );
		}
		return false;
	}
	//
	// on edit window closed
	//
	onClose( saved: boolean ) {
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.onClose: entering: ${saved}` );
		}
		if( saved === true ) {
			if( this.logLevel >= 3 ) {
				console.log( `${this.codeName}.onClose: Refreshing...` );
			}
			this.refreshWithVisibility();
		}
		this.windowDisplay = false;
		this.detailWindow = undefined;
		this.windowIncident = undefined;
	}
	//
	// onChangeServer( "server" )
	// Launch server selection window
	//
	onChangeServer( event ) {
		if( this.logLevel >= 3 ) {
			console.log( `${this.codeName}.onChangeServer: entering: ${event}` );
		}
		this.selectItemsWindow = this.user.ServerShortNames;
		this.displayServersWindow = true;
		console.log( `${this.codeName}.onChangeServer: ${event.value}` );
	}
	//
	// onServerSelected($event)
	//
	onServerSelected( event: any ) {
		this.getUserServer( this.user.UserName, event );
		console.log( `${this.codeName}.onServerSelected: ${event}` );
	}
	//
	// updateVisibility, refresh by instantly toggling visiblity
	//
	refreshWithVisibility(): void {
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.refreshWithVisibility: entered` );
		}
		this.visible = false;
		setTimeout( ( ) => this.visible = true );
	}
	//
	// --------------------------------------------------------------------
	// File access
	// get user with user service
	// getAll, delete & serviceErrorHandler
	//
	getUserServer( userName: string, serverShortName: string ) {
		//
		console.log( `${this.codeName}.getUserServer: user: ${userName}, short: ${serverShortName}` );
		this._user.getUserServer( userName, serverShortName )
								.subscribe( ( userData: User ) => {
			if( this.logLevel >= 4 ) {
				console.log( `${this.codeName}.authUser: user: ${userData.UserName}` );
			}
			if( userData.ServerShortName !== ''
				&& userData.ServerShortName.toLowerCase()
						=== serverShortName.toLowerCase() ) {
					const changed: boolean = ( userData.ServerShortName.toLowerCase() !== this.user.ServerShortName.toLocaleLowerCase() );
					this.user = userData;
					this.dt.filter( this.user.Server.ServerId, 'ServerId', 'equals' );
					this.displayServersWindow = false;
			} else {
				if( this.logLevel >= 4 ) {
					console.log( `${this.codeName}.getUserServer, Returned: ${userData.ServerShortName}` );
				}
				this.selectItemsWindow = this.user.ServerShortNames;
				this.displayServersWindow = true;
			}
		},
		error => this.serviceErrorHandler(
			`User not found: ${userName}`, error ));
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
			this._data.getIncidentsLazy( event ).subscribe((incidentPaginationData) => {
				this.loading = false;
				this.incidents = incidentPaginationData.incidents;
				this.totalRecords = incidentPaginationData.totalRecords;
			}, ( error ) => {
				this.loading = false;
				this.serviceErrorHandler(
					`${this.codeName}.loadIncidentsLazy getIncidentsLazy`, error );
			});
		}, 0 );
	}
	//
	// Call delete data service,
	// if successful then delete the row from array
	//
	deleteItem( ): boolean {
		const delId: number = this.id;
		if( this.id !== 0 ) {
			this._data.deleteIncident( delId )
				.subscribe(
					() => {
						this.incidents = this.incidents.filter(function(el) {
							return el.IncidentId !== delId;
							});
						this._alerts.setWhereWhatSuccess(
							'Incident-Grid', 'Deleted:' + delId);
					},
					error => this.serviceErrorHandler(
						'Incident-Grid Delete', error ));
		}
		return false;
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
// End of incident-grid.component.ts
