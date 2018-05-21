// ===========================================================================
import { Observable, throwError, of } from 'rxjs';
//
import { ServicesService } from '../../../net-incident/services/services.service';
//
export class ServicesServiceMock extends ServicesService {
	//
	public mockResponse: string;
	//
	constructor( ) {
		super(null);
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
