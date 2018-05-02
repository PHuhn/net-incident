// ===========================================================================
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { environment } from '../environments/environment';
//
import { AlertsService } from './global/alerts/alerts.service';
import { AuthService } from './net-incident/services/auth.service';
import { IUser, User } from './net-incident/user';
import { IncidentGridComponent } from 
  './net-incident/incident-grid/incident-grid.component';
import { ServerData } from './net-incident/server-data';
import { SelectItemClass } from './net-incident/select-item-class';
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
	codeName: string = 'App-Component'
  //
  authenticated: boolean = false;
  userAccount: string = environment.defaultUserAccount;
  userPassword: string = '';
  user: User = undefined;
  logLevel: number = 1;
  //
	// Constructor of the this the app.component
	//
  constructor(
		private _alerts: AlertsService,
    private _auth: AuthService ) {  }
	//
	//	On component initialization, get all data from the data service.
	//
	ngOnInit() {
    // 1=error, 2=warning, 3=info, 4=verbose
    this.logLevel = environment.logLevel;
    console.log( `${this.codeName}.ngOnInit: LogLevel is: ${this.logLevel}.`);
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
    this.authenticated = true;
  }
  //
  // (logout)='onAuthLogout($event)
  // onClick of Logout button in the header.component
  //
  onAuthLogout(event): void {
    if( this.logLevel <= 4 )
      console.log( `${this.codeName}.onAuthLogout: Logout clicked.`);
    this._auth.logout( );
    this.authenticated = false;
  }
	//
	//	Handle an error from the data service.
	//
	serviceErrorHandler( where: string, error: string ) {
    if( this.logLevel <- 4 )
  		console.error( error );
		this._alerts.setWhereWhatError( where,
			'User-Service failed.',
			error || 'Server error');
  }
  //
  fakeLogin() {
    let server = new ServerData(
      1, 1, 'Northern Software Group', 'NSG Memb', "Members Web-site",
      "Public facing members Web-site", "Web-site address: www.mimilk.com",
      "We are in Michigan, USA.", "Phil Huhn", "Phil", "PhilHuhn@yahoo.com",
      "EST (UTC-5)", true,  "EDT (UTC-4)",
      new Date('2018-03-11T02:00:00'), new Date('2018-11-04T02:00:00')
    );
    this.user = new User(
      'e0fcb3e8-252a-4311-b782-7e094f0737aa', 'Phil', 'Phillip', 'Huhn', 
      'Phil Huhn', "Phil", "PhilHuhn@yahoo.com", true, "734-545-5845", true,
      1, [ new SelectItemClass( 'NSG Memb', 'Members Web-site' ),
        new SelectItemClass( 'NSG Router', 'NSG Router' ) ],
      "nsg router", server
    );
    this.authenticated = true;
    // this.user = <User>'{"Id":"e0fcb3e8-252a-4311-b782-7e094f0737aa","UserName":"Phil","FirstName":"Phillip","LastName":"Huhn","FullName":"Phil Huhn","UserNicName":"Phil","Email":"PhilHuhn@yahoo.com","EmailConfirmed":true,"PhoneNumber":"734-545-5845","PhoneNumberConfirmed":true,"CompanyId":1,"ServerShortNames":[{"value":"NSG Memb","label":"Members Web-site","styleClass":""}],"ServerShortName":"nsg memb","Server":{"ServerId":1,"CompanyId":1,"CompanyName":"Northern Software Group","ServerShortName":"NSG Memb","ServerName":"Members Web-site","ServerDescription":"Public facing members Web-site","WebSite":"Web-site address: www.mimilk.com","ServerLocation":"We are in Michigan, USA.","FromName":"Phil Huhn","FromNicName":"Phil","FromEmailAddress":"PhilHuhn@yahoo.com","TimeZone":"EST (UTC-5)","DST":true,"TimeZone_DST":"EDT (UTC-4)","DST_Start":"2018-03-11T02:00:00","DST_End":"2018-11-04T02:00:00"}}';
  } 
  //
}
// ===========================================================================
