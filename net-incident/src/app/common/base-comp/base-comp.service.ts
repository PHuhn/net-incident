// ===========================================================================
// File: base-comp.service.ts
import { Injectable } from '@angular/core';
//
import { ConfirmationService } from 'primeng/api';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
//
@Injectable({
	providedIn: 'root'
})
export class BaseCompService {
	/*
	** This will change and services may be added, so let the
	** injector handle the addition of stuff.
	*/
	constructor(
		// communicate to the AlertComponent
		public _alerts: AlertsService,
		// to write console logs condition on environment log-level
		public _console: ConsoleLogService,
		// PrimeNG's service to communicate to modal OK/Cancel popup
		public _confirmationService: ConfirmationService
	) { }
	//
}
// ===========================================================================
