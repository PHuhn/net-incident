// ===========================================================================
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
//
import { ServicesService } from '../../../net-incident/services/services.service';
import { ConsoleLogService } from '../../../global/console-log.service';
//
@Injectable( { providedIn: 'root' } )
export class ServicesServiceMock extends ServicesService {
	//
	public mockResponse: string;
	//
	constructor(
		_console: ConsoleLogService
	) {
		super(null, _console);
		this.codeName = 'services-service-mock';
	}
	//
	// Get service for ip address
	//
	getService( urlPath: string ): Observable<string> {
		return of( this.mockResponse );
	}
	//
}
// ===========================================================================
