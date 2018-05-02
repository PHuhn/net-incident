// ===========================================================================
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { UserService } from '../../net-incident/services/user.service';
import { IUser, User } from '../../net-incident/user';
//
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  //
  //  local variables
  //
	private codeName: string = 'Register-Component'; 
  registerAccount: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerConfirmPassword: string = '';
  registerFirstName: string = '';
  registerLastName: string = '';
  registerServerShortName: string = '';
  //
  //  constructor...
  //
  constructor(
		private _alerts: AlertsService,
    private _user: UserService ) {  }
	//
  ngOnInit() {
  }
  //
  registerUser() {
    this._alerts.setWhereWhatWarning( this.codeName, 'Not implemented.')
  }
	//
	// Handle an error from the data service.
	//
	serviceErrorHandler( where: string, error: string ) {
		console.error( error );
		this._alerts.setWhereWhatError( where,
			'User-Service failed.',
			error || 'Server error');
	}
  //
}
// ===========================================================================
