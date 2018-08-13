// File: incident-grid.component.ts
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
//
import { TableModule } from '../../../../node_modules/primeng/components/table/table';
import { ConfirmDialog } from '../../../../node_modules/primeng/components/confirmdialog/confirmdialog';
import { ConfirmationService } from '../../../../node_modules/primeng/components/common/confirmationservice';
import { SelectItem } from '../../../../node_modules/primeng/components/common/selectitem';
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
import { AppComponent } from '../../app.component';
//
@Component({
	selector: 'app-incident-grid',
	templateUrl: './incident-grid.component.html'
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
		// load all records
		this.getAllIncidents();
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
			if( this.logLevel >= 3 ) {
				console.log( `${this.codeName}.deleteItemClicked: ${this.id}` );
			}
			// the p-confirmDialog in in app.component
			this._confirmationService.confirm({
				key: 'Delete',
				message: 'Are you sure you want to delete ' + this.id + '?',
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
			this.getAllIncidents( );
		}
		this.windowDisplay = false;
		this.detailWindow = undefined;
		this.windowIncident = undefined;
	}
	//
	// (change)='onCheckboxChanged( $event )'
	//
	onCheckboxChanged( event: any ) {
		this.getAllIncidents( );
	}
	//
	// onChangeServer( "server" )
	// Launch server selection window
	//
	onChangeServer( event: any ) {
		if( this.logLevel >= 3 ) {
			console.log( `${this.codeName}.onClose: entering: ${event}` );
		}
		this.selectItemsWindow = this.user.ServerShortNames;
		this.displayServersWindow = true;
	}
	//
	// onServerSelected($event)
	//
	onServerSelected( event: any ) {
		this.getUserServer( this.user.UserName, event );
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
					if ( changed ) {
						this.getAllIncidents( );
					}
					this.displayServersWindow = false;
			} else {
				if( this.logLevel >= 4 ) {
					console.log( `${this.codeName}.getUserServer, Returned: ${userData.ServerShortName}` );
				}
				this.selectItemsWindow = this.user.ServerShortNames;
				this.displayServersWindow = true;
			}
		},
		error =>  this.serviceErrorHandler(
			`User not found: ${userName}`, error ));
		//
	}
	getAllIncidents( ): void {
		this._data.getIncidents( this.user.Server.ServerId, this.mailed, this.closed, this.special ).subscribe((incidentData) => {
			this.incidents = incidentData;
			this.totalRecords = this.incidents.length;
			if( this.id !== undefined && this.id === 0 ) {
				const editId: number = this.id;
				const item: Incident[] = this.incidents.filter(function(el) {
					return el.IncidentId === editId;
				} );
				if( this.logLevel >= 3 ) {
					console.log( item );
				}
			}
		}, ( error ) =>
			this.serviceErrorHandler(
				'Incident-Grid Get All', error ));
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
					error =>  this.serviceErrorHandler(
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
