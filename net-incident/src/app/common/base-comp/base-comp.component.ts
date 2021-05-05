/*
** ===========================================================================
** File: base-comp.component.ts
** Ideas for base component class:
** * Consistent error handling/logging
** * Authentication helpers
** * Authorization helper
** * Consistent UI/Breadcrumbs/Title/Flags
** * Config file helpers
** * Navigation
*/
import { Component } from '@angular/core';
// PrimeNG
import { ConfirmationService } from 'primeng/api';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
import { BaseCompService } from './base-comp.service';
//
type DeleteCallback<T> = (n: T) => boolean;
//
@Component({
	template: ``
})
export class BaseComponent {
	/*
	** Base component class that does 6 things:
	** * codeName string variable,
	** * injects alerts service,
	** * injects console log service,
	** * inject confirmation service (PrimeNG),
	** * baseDeleteConfirm<T>( id, callBack) method
	** * baseErrorHandler( where, what, error ) method
	*/
	protected codeName: string = 'base-component';
	// communicate to the AlertComponent
	protected _alerts: AlertsService;
	// to write console logs condition on environment log-level
	protected _console: ConsoleLogService;
	// PrimeNG's service to communicate to modal OK/Cancel popup
	protected _confirmationService: ConfirmationService;
	/*
	** On component creation (inject services).
	*/
	constructor(
		// inject the services needed
		public _baseServices: BaseCompService
	) {
		this._alerts = _baseServices._alerts;
		this._console = _baseServices._console;
		this._confirmationService = _baseServices._confirmationService;
	}
	/*
	** Delete button clicked, confirm this deletion. Display the
	** following PrimeNG confirmation dialog:
	** +-------------------------------------+
	** | Delete Confirmation                 |
	** | Are you sure you want to delete 56? |
	** |               +-------+ +-------+   |
	** |               | x  No | | x Yes |   |
	** +---------------+-------+-+-------+---+
	** Requirements:
	** Need to add something like the follow to your app.component:
	** <p-confirmDialog header='Delete Confirmation' key='delete' icon='pi pi-trash'></p-confirmDialog>
	** Inject a method and call it like:
	**
	** const callBack: DeleteCallback<number> = (ident: number): boolean => {
	**	return this.deleteItem( ident );
	** };
	** return this.baseDeleteConfirm<number>( id, callBack );
	**
	** or:
	**
	** return this.baseDeleteConfirm<number>( id, (ident: number): boolean => {
	**	return this.deleteItem( ident );
	** } );
	*/
	baseDeleteConfirm<T>( id: T, callBack: DeleteCallback<T>, label: string = '' ): boolean {
		let display: string = String( id );
		if( label !== '' ) {
			display = `${label} (${id})`;
		}
		this._console.Verbose(
			`${this.codeName}.baseDeleteConfirm: ${display}` );
		this._confirmationService.confirm({
			key: 'delete',
			message: `Are you sure you want to delete ${display}?`,
			accept: () => {
				this._console.Information(
					`${this.codeName}.baseDeleteConfirm: User's response: true` );
				return callBack( id );
			},
			reject: () => {
				this._console.Verbose(
					`${this.codeName}.baseDeleteConfirm: User's dismissed.` );
			}
		});
		return false;
	}
	/*
	** Handle an error from the data service.
	** 1) Log a red log to the console,
	** 2) throw up a red alert message in the upper right corner.
	*/
	baseErrorHandler( where: string, what: string, error: string | undefined ) {
		this._console.Error(
			`${this.codeName}.baseErrorHandler: ${where}, ${what}, ${error}` );
		this._alerts.setWhereWhatError(
			where, what, error || 'Server error');
	}
	//
}
// ===========================================================================
