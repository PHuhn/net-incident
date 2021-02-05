// ===========================================================================
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
//
import { SelectItem } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { Message } from '../../global/alerts/message';
import { AlertLevel } from '../../global/alerts/alert-level.enum';
import { UserService } from '../../net-incident/services/user.service';
import { AuthService } from '../../net-incident/services/auth.service';
import { IUser, User } from '../../net-incident/user';
import { LoginViewModel } from '../../net-incident/login-view-model';
import { TokenResponse } from '../../net-incident/token-response';
import { Login } from '../../net-incident/login';
import { ServerSelectionWindowComponent } from '../../net-incident/server-selection-window/server-selection-window.component';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
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
	//
	// constructor...
	//
	constructor(
		private _alerts: AlertsService,
		private _auth: AuthService,
		private _user: UserService,
		private _console: ConsoleLogService ) { }
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
		//
	}
	//
	// authenticate user with auth service
	//
	loginUser(): number {
		// get the user record
		this._console.Information(
			`${this.codeName}.authUser: ${this.model.UserName}` );
		//
		let errMsgs: Message[] = this.model.validate( );
		if( errMsgs.length > 0 ) {
			this._alerts.setAlerts( AlertLevel.Error, errMsgs );
			return -1;
		}
		this._auth.authenticate( this.model.UserName, this.model.Password )
			.subscribe( ( tokenData: TokenResponse ) => {
			//
			// access_token: string;
			// token_type: string;
			// expires_in: number;
			// userName: string;
			this._console.Information(
				`${this.codeName}.authUser: authenticated: ${tokenData.access_token} ${tokenData.token_type} ${tokenData.userName}` );
			this.getUserServer( this.model.UserName, this.model.ServerShortName );
			return 1;
			//
		},
		error => {
			this._console.Error(
				`${this.codeName}.authUser: authenticate: ${this.model.UserName} ${error}` );
			this.serviceErrorHandler(
				`User not found: ${this.model.UserName}`, error );
			return -2;
		});
		return 0;
		//
	}
	//
	// get user with user service
	//
	getUserServer( userName: string, serverShortName: string ) {
		//
		this._user.getUserServer( userName, serverShortName )
			.subscribe( ( userData: User ) => {
				this._console.Information(
					`${this.codeName}.getUserServer: user: ${userData.UserName}` );
				this._console.Information( JSON.stringify( userData ) );
				this.user = userData;
				if( serverShortName !== ''
						&& userData.ServerShortName.toLowerCase()
							=== serverShortName.toLowerCase() ) {
					this.onClose.emit( this.user );
				} else {
					this._console.Information(
						`${this.codeName}.getUserServer: Returned: ${userData.ServerShortName}` );
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
		this._console.Information(
			`${this.codeName}.onServerSelected: selected: ${shortName}` );
		this.displayServersWindow = false;
		this.model.ServerShortName = shortName;
		this.getUserServer( this.model.UserName, this.model.ServerShortName );
	}
	//
	// Handle an error from the data service.
	//
	serviceErrorHandler( where: string, error: string ) {
		this._console.Error(
			`${this.codeName}.serviceErrorHandler: ${where}, ${error}` );
		this._alerts.setWhereWhatError( where,
			'User-Service failed.', error || 'Server error');
	}
	//
}
// ===========================================================================
