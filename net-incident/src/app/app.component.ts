// ===========================================================================
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { environment } from '../environments/environment';
//
import { AlertsService } from './global/alerts/alerts.service';
import { AuthService } from './net-incident/services/auth.service';
import { ConsoleLogService } from './global/console-log/console-log.service';
import { IUser, User } from './net-incident/user';
import { Security } from './net-incident/security';
import { IncidentGridComponent } from './net-incident/incident-grid/incident-grid.component';
import { ServerData } from './net-incident/server-data';
import { SelectItemClass } from './global/select-item-class';
//
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	//
	static securityManager: Security | undefined;
	codeName: string = 'App-Component';
	//
	authenticated: boolean = false;
	userAccount: string = environment.defaultUserAccount;
	userPassword: string = '';
	user: User;
	//
	// Constructor of the this the app.component
	//
	constructor(
		private _alerts: AlertsService,
		private _console: ConsoleLogService,
		private _auth: AuthService
	) {
		this.user = User.empty( );
			
	}
	//
	// On component initialization, get all data from the data service.
	//
	ngOnInit() {
		this._console.Information( `${this.codeName}.ngOnInit: ...`);
	}
	//
	ngAfterViewInit() {
	}
	//
	// (onClose)='onAuthenticated($event)
	// of the login.component
	//
	onAuthenticated( user: User ): void {
		this.user = user;
		const security: Security = new Security( this.user );
		if( security.isValidIncidentGrid( ) ) {
			AppComponent.securityManager = security;
			this.authenticated = true;
		} else {
			this._alerts.setWhereWhatWarning( this.codeName, 'Not authorized' );
		}
	}
	//
	// (logout)='onAuthLogout($event)
	// onClick of Logout button in the header.component
	//
	onAuthLogout(event: any): void {
		this._console.Information( `${this.codeName}.onAuthLogout: Logout clicked.`);
		this._auth.logout( );
		AppComponent.securityManager = undefined;
		this.authenticated = false;
	}
	//
	fakeLogin() {
		const server = new ServerData(
			1, 1, 'Northern Software Group', 'NSG Memb', 'Members Web-site',
			'Public facing members Web-site', 'Web-site address: www.mimilk.com',
			'We are in Michigan, USA.', 'Phil Huhn', 'Phil', 'PhilHuhn@yahoo.com',
			'EST (UTC-5)', true, 'EDT (UTC-4)',
			new Date('2018-03-11T02:00:00'), new Date('2018-11-04T02:00:00')
		);
		this.user = new User(
			'e0fcb3e8-252a-4311-b782-7e094f0737aa', 'Phil', 'Phillip', 'Huhn',
			'Phil Huhn', 'Phil', 'PhilHuhn@yahoo.com', true, '734-545-5845', true,
			1, [ new SelectItemClass( 'NSG Memb', 'Members Web-site' ),
				new SelectItemClass( 'NSG Router', 'NSG Router' ) ],
			'nsg router', server, ['admin']
		);
		this.authenticated = true;
	}
	//
}
// ===========================================================================
