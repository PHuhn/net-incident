// ===========================================================================
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
//
import { SelectItem } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { Message } from '../../global/message';
import { AlertLevel } from '../../global/alert-level.enum';
import { UserService } from '../../net-incident/services/user.service';
import { AuthService } from '../../net-incident/services/auth.service';
import { IUser, User } from '../../net-incident/user';
import { LoginViewModel } from '../../net-incident/login-view-model';
import { TokenResponse } from '../../net-incident/token-response';
import { Login } from '../../net-incident/login';
import { ServerSelectionWindowComponent } from '../../net-incident/server-selection-window/server-selection-window.component';
//
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	//
	private codeName: string = 'Login-Component';
	user: User = undefined;
	model: Login;
	selectItemsWindow: SelectItem[];
	displayServersWindow: boolean = false;
	logLevel: number = 1;
	//
	// constructor...
	//
	constructor(
		private _alerts: AlertsService,
		private _auth: AuthService,
		private _user: UserService ) { }
	//
	@Output() onClose = new EventEmitter<User>();
	//
	// authenticate user
	//
	ngOnInit() {
		//
		this.model = new Login(
			environment.defaultUserAccount, '', ''
		);
		// 1=error, 2=warning, 3=info, 4=verbose
		this.logLevel = environment.logLevel;
		//
	}
	//
	// authenticate user with auth service
	//
	loginUser() {
		// get the user record
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.authUser: ${this.model.UserName}` );
		}
		//
		let errMsgs: Message[] = this.model.validate( );
		if( errMsgs.length > 0 ) {
			this._alerts.setAlerts( AlertLevel.Error, errMsgs );
			return;
		}
		this._auth.authenticate( this.model.UserName, this.model.Password ).subscribe( ( tokenData: TokenResponse ) => {
			//
			if( this.logLevel >= 4 ) {
				// access_token: string;
				// token_type: string;
				// expires_in: number;
				// userName: string;
				console.log( `${this.codeName}.authUser: authenticated: ${tokenData.access_token} ${tokenData.token_type} ${tokenData.userName}` );
			}
			this.getUserServer( this.model.UserName, this.model.ServerShortName );
			//
		},
		error => this.serviceErrorHandler(
			`User not found: ${this.model.UserName}`, error ));
		//
	}
	//
	// get user with user service
	//
	getUserServer( userName: string, serverShortName: string ) {
		//
		this._user.getUserServer( userName, serverShortName )
			.subscribe( ( userData: User ) => {
				if( this.logLevel >= 4 ) {
					console.log( `${this.codeName}.getUserServer: user: ${userData.UserName}` );
					console.log( userData );
				}
				this.user = userData;
				if( serverShortName !== ''
						&& userData.ServerShortName.toLowerCase()
							=== serverShortName.toLowerCase() ) {
					this.onClose.emit( this.user );
				} else {
					if( this.logLevel >= 4 ) {
						console.log( 'Returned: ' + userData.ServerShortName );
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
	// on server-selection-window closed
	//
	onServerSelected( shortName: string ) {
		if( this.logLevel >= 4 ) {
			console.log( 'selected: ' + shortName );
		}
		this.displayServersWindow = false;
		this.model.ServerShortName = shortName;
		this.getUserServer( this.model.UserName, this.model.ServerShortName );
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
