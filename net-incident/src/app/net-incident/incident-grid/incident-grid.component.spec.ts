// ===========================================================================
import { ComponentFixture, TestBed, inject, fakeAsync, tick, discardPeriodicTasks, getTestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { By } from '@angular/platform-browser';
import { HttpResponse } from '@angular/common/http';
//
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FocusTrapModule } from 'primeng/focustrap';
import { Header, Footer } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, Confirmation, LazyLoadEvent, SelectItem } from 'primeng/api';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { Alerts } from '../../global/alerts/alerts';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
import { ServicesService } from '../services/services.service';
import { ServicesServiceMock } from '../services/mocks/ServicesService.mock';
import { UserService } from '../../net-incident/services/user.service';
import { IncidentService } from '../services/incident.service';
import { NetworkIncidentService } from '../services/network-incident.service';
import { ConfirmationServiceMock } from '../services/mocks/ConfirmationService.mock';
//
import { TruncatePipe } from '../../global/truncate.pipe';
import { DetailWindowInput } from '../DetailWindowInput';
import { IUser, User } from '../user';
import { ServerData } from '../server-data';
import { SelectItemClass } from '../../global/select-item-class';
import { IIncident, Incident } from '../incident';
import { INetworkLog, NetworkLog } from '../network-log';
import { NetworkIncident } from '../network-incident';
import { IncidentPaginationData } from '../incident-pagination-data';
import { IncidentGridComponent } from './incident-grid.component';
import { IncidentDetailWindowComponent } from '../incident-detail-window/incident-detail-window.component';
import { ServerSelectionWindowComponent } from '../../net-incident/server-selection-window/server-selection-window.component';
import { NetworkLogGridComponent } from '../network-log-grid/network-log-grid.component';
import { IncidentNoteGridComponent } from '../incident-note-grid/incident-note-grid.component';
import { IncidentNoteDetailWindowComponent } from '../incident-note-detail-window/incident-note-detail-window.component';
import { LazyLoadingMock } from '../services/mocks/LazyLoading.mock';
//
import { AppComponent } from '../../app.component';
import { Security } from '../security';
//
describe( 'IncidentGridComponent', ( ) => {
	let sut: IncidentGridComponent;
	let fixture: ComponentFixture<IncidentGridComponent>;
	let lazyLoading: LazyLoadingMock = new LazyLoadingMock();
	let alertService: AlertsService;
	const selectionWindowTitleSelector: string =
		'#serverSelectionWindow > div > div > div > span.p-dialog-title > p-header';
	// document.querySelector('#serverSelectionWindow > div > div > div > span.p-dialog-title > p-header')
	const userServiceSpy = jasmine.createSpyObj('UserService',
			['emptyUser', 'getUser', 'getUserServer']);
	let servicesServiceMock: ServicesServiceMock;
	const incidentServiceSpy = jasmine.createSpyObj(
		'IncidentService', ['emptyIncident', 'getIncidentsLazy', 'deleteIncident']);
	let confirmService: ConfirmationServiceMock;
	const networkIncidentServiceSpy = jasmine.createSpyObj(
		'NetworkIncidentService', ['validateIncident', 'validateNetworkLog',
		'validateNetworkLogs', 'getNetworkIncident', 'createIncident', 'updateIncident']);
	// let detailWindow: DetailWindowInput;
	const expectedWindowTitle: string = 'Incident Detail';
	const windowTitleSelector: string =
		'app-incident-detail-window > p-dialog > div > div.p-dialog-titlebar > span > p-header > div';
	const testDate: Date = new Date('2000-01-01T00:00:00');
	const startDate: Date = new Date('2018-03-11T02:00:00');
	const endDate: Date = new Date('2018-11-04T02:00:00');
	const server = new ServerData(
		1, 1, 'NSG', 'Srv 1', 'Members Web-site',
		'Web-site', 'Web-site address: www.nsg.com',
		'We are in Michigan, USA.', 'Phil Huhn', 'Phil', 'PhilHuhn@yahoo.com',
		'EST (UTC-5)', true,  'EDT (UTC-4)', startDate, endDate
	);
	const user: User = new User('e0-01','U1','U','N','U N','U','UN1@yahoo.com',true,'734-555-1212', true,1,
		[new SelectItemClass('srv 1','Server 1'), new SelectItemClass('srv 2','Server 2')],'srv 1', server,['admin']);
	//
	const mockDatum = [
		new Incident( 1,1,'193.1','arin.net','i 1','i1@1.com','',true,true,true,'',testDate ),
		new Incident( 2,1,'193.2','ripe.net','i 2','i2@2.com','',false,false,false,'Note 2',testDate ),
		new Incident( 3,1,'193.3','ripe.net','i 3','i3@3.com','',true,true,true,'',testDate ),
		new Incident( 4,1,'193.4','ripe.net','i 4','i4@4.com','',false,false,false,'Note 4',testDate ),
		new Incident( 5,1,'193.5','ripe.net','i 5','i5@5.com','',true,true,true,'',testDate ),
		new Incident( 6,2,'193.6','arin.net','i 6','i6@6.com','',false,false,false,'',testDate ),
		new Incident( 7,1,'193.7','arin.net','i 7','i7@7.com','',false,false,false,'',testDate )
	];
	const mockLogs = [
		new NetworkLog( 1,1,null,'193.1',new Date( '2018-02-27T00:00:00' ),'Log 1',1, 'SQL', false ),
		new NetworkLog( 2,1,2,'193.2',new Date( '2018-02-27T00:00:00' ),'Log 2',1, 'SQL', false ),
		new NetworkLog( 3,1,null,'193.3',new Date( '2018-02-27T00:00:00' ),'Log 3',1, 'SQL', false ),
		new NetworkLog( 4,1,4,'193.4',new Date( '2018-02-27T00:00:00' ),'Log 4',1, 'SQL', false ),
		new NetworkLog( 5,1,null,'193.5',new Date( '2018-02-27T00:00:00' ),'Log 5',1, 'SQL', false ),
		new NetworkLog( 6,1,null,'193.5',new Date( '2018-02-27T00:00:00' ),'Log 6',1, 'SQL', false )
	];
	const selectItemsWindow: SelectItem[] = user.ServerShortNames;
	const displayServersWindow: boolean = false;
	//
	beforeEach( waitForAsync( ( ) => {
		TestBed.configureTestingModule( {
			imports: [
				FormsModule,
				TableModule,
				ButtonModule,
				DropdownModule,
				FocusTrapModule,
				BrowserAnimationsModule
			],
			declarations: [
				IncidentGridComponent,
				IncidentDetailWindowComponent,
				ServerSelectionWindowComponent,
				NetworkLogGridComponent,
				IncidentNoteGridComponent,
				IncidentNoteDetailWindowComponent,
				TruncatePipe,
				Dialog,
				ConfirmDialog
			],
			providers: [
				AlertsService,
				ConsoleLogService,
				{ provide: UserService, useValue: userServiceSpy },
				{ provide: ServicesService, useClass: ServicesServiceMock },
				{ provide: IncidentService, useValue: incidentServiceSpy },
				{ provide: NetworkIncidentService, useValue: networkIncidentServiceSpy },
				{ provide: ConfirmationService, useClass: ConfirmationServiceMock }
			]
		});
		alertService = TestBed.get( AlertsService );
		servicesServiceMock = TestBed.get( ServicesService );
		confirmService =  TestBed.get( ConfirmationService );
		TestBed.compileComponents( );
	}));
	//
	beforeEach( waitForAsync( ( ) => {
		// clone the array with slice( 0 )
		const page = new IncidentPaginationData( );
		const event = {"first":0,"rows":5,"sortField":"IncidentId","sortOrder":-1,"filters":{"ServerId":{"value":1,"matchMode":"equals"},"Mailed":{"value":false,"matchMode":"equals"},"Closed":{"value":false,"matchMode":"equals"},"Special":{"value":false,"matchMode":"equals"}},"globalFilter":null} as LazyLoadEvent;
		page.incidents = lazyLoading.LazyLoading( mockDatum, event );
		page.loadEvent = event;
		page.totalRecords = page.incidents.length;
		incidentServiceSpy.getIncidentsLazy.and.returnValue( of( page ) );
		userServiceSpy.getUserServer.and.returnValue(of( user ));
		AppComponent.securityManager = new Security( user );
		//
		fixture = TestBed.createComponent( IncidentGridComponent );
		sut = fixture.componentInstance;
		// push in the @Input
		sut.user = user;
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
	} ) );
	//
	afterEach(() => {
		//
	});
	//
	function newNetworkIncident( incident: Incident ): NetworkIncident {
		const _ni = new NetworkIncident( );
		_ni.incident = incident;
		_ni.incidentNotes = [];
		_ni.deletedNotes = [];
		_ni.networkLogs = mockLogs;
		console.log( _ni.networkLogs );
		_ni.networkLogs.forEach( (row) => {
			if( _ni.incident.IncidentId === row.IncidentId ) {
				row.Selected = true;
			} else {
				row.Selected = false;
			}
		});
		_ni.deletedLogs = [];
		_ni.typeEmailTemplates = [];
		_ni.NICs = [];
		_ni.incidentTypes = [];
		_ni.noteTypes = [];
		_ni.message = '';
		_ni.user = user;
		return _ni;
	}
	//
	// Component instantiates
	//
	it( 'should be created ...', waitForAsync( () => {
		console.log(
			'===================================\n' +
			'IncidentGridComponent should create ...' );
		expect( sut ).toBeTruthy( );
	} ) );
	//
	// getIncidents( ) : Observable<IIncident[]>
	//
	it('should initialize with all data...', fakeAsync( () => {
		// console.log( sut.incidents );
		expect( sut.incidents.length ).toBe( 3 );
		//
		expect( sut.incidents[ 0 ].IncidentId ).toEqual( 7 );
		expect( sut.incidents[ 1 ].IncidentId ).toEqual( 4 );
		expect( sut.incidents[ 2 ].IncidentId ).toEqual( 2 );
		//
	}));
	/*
	** test of getUserServer, succeed
	*/
	it('getUserServer select a different server ...', fakeAsync( ( ) => {
		//
		const serverShortName = 'srv 2';
		// setup response to _user.getUserServer service call
		let user2 = {...user};
		user2.Server.ServerName = 'Server 2';
		user2.Server.ServerShortName = serverShortName;
		user2.ServerShortName = serverShortName;
		userServiceSpy.getUserServer.and.returnValue(of( user2 ));
		sut.getUserServer( sut.user.UserName, serverShortName );
		//
		tick(1000); // wait 1 second task to get done
		fixture.detectChanges( ); // trigger initial data binding
		tick(1000); // wait 1 second task to get done
		fixture.detectChanges( ); // trigger initial data binding
		//
		expect( sut.user.ServerShortName ).toEqual( serverShortName );
		//
	} ) );
	/*
	** onServerSelected( event: any )
	** test of getUserServer, succeed
	*/
	it('getUserServer select a different server ...', fakeAsync( ( ) => {
		//
		const serverShortName = 'srv 2';
		// setup response to _user.getUserServer service call
		let user2 = {...user};
		user2.Server.ServerName = 'Server 2';
		user2.Server.ServerShortName = serverShortName;
		user2.ServerShortName = serverShortName;
		userServiceSpy.getUserServer.and.returnValue(of( user2 ));
		sut.onServerSelected( serverShortName );
		//
		tick(1000); // wait 1 second task to get done
		fixture.detectChanges( ); // trigger initial data binding
		tick(1000); // wait 1 second task to get done
		fixture.detectChanges( ); // trigger initial data binding
		//
		expect( sut.user.ServerShortName ).toEqual( serverShortName );
		//
	} ) );
	/*
	** onChangeServer( ), launch server selection window
	*/
	it('should launch server selection window when onChangeServer is called ...', fakeAsync( () => {
		sut.onChangeServer( 'testing' );
		//
		tick(1000); // wait 1 second task to get done
		fixture.detectChanges( ); // trigger initial data binding
		//
		expect( sut.displayServersWindow ).toEqual( true );
		const title: HTMLDivElement = fixture.debugElement.query(By.css(
			selectionWindowTitleSelector )).nativeElement;
		expect( title.innerText.trim( ) ).toEqual( `Select a server` );
	}));
	/*
	** addItemClicked( )
	*/
	it('should launch detail window when addItemClicked is called ...', fakeAsync( () => {
		let inc = new Incident( 0,0,'','','','','',false,false,false,'',testDate );
		incidentServiceSpy.emptyIncident.and.returnValue(of( inc ));
		const response: NetworkIncident = newNetworkIncident(
			inc
		);
		const id = response.incident.IncidentId; // for title
		const ip = response.incident.IPAddress;
		networkIncidentServiceSpy.getNetworkIncident.and.returnValue( of( response ) );
		sut.addItemClicked( );
		//
		tick(1000); // wait 1 second task to get done
		fixture.detectChanges( ); // trigger initial data binding
		tick(1000); // wait 1 second task to get done
		fixture.detectChanges( ); // trigger initial data binding
		//
		expect( sut.windowDisplay ).toEqual( true );
		const title: HTMLDivElement = fixture.debugElement.query(By.css(
			'#IncidentDetailWindowHeader' )).nativeElement;
		expect( title.innerText.trim( ) ).toEqual( `Incident Detail: , IP Address:` );
	}));
	/*
	** editItemClicked( item: Incident )
	*/
	it('should launch detail window when editItemClicked is called ...', fakeAsync( ( ) => {
		const incident: Incident = sut.incidents[ 1 ];
		const response: NetworkIncident = newNetworkIncident( incident );
		const id = response.incident.IncidentId; // for title
		const ip = response.incident.IPAddress;
		networkIncidentServiceSpy.getNetworkIncident.and.returnValue(of( response ));
		sut.editItemClicked( incident );
		expect( sut.windowDisplay ).toEqual( true );
		tick(1000); // wait 1 second task to get done
		fixture.detectChanges( ); // trigger initial data binding
		tick(1000); // wait 1 second task to get done
		fixture.detectChanges( ); // trigger initial data binding
		//
		const title: HTMLDivElement = fixture.debugElement.query(By.css(
			'#IncidentDetailWindowHeader' )).nativeElement;
		expect( title.innerText.trim( ) ).toEqual( `Incident Detail: ${id}, IP Address: ${ip}` );
		sut.windowDisplay = false;
	}));
	/*
	** deleteItem( ) :boolean
	*/
	it( 'should handle an error on delete...', fakeAsync( () => {
		//
		const response = new HttpResponse( { status: 500, statusText: 'Fake Error' } );
		incidentServiceSpy.deleteIncident.and.returnValue(of( response ));
		const id = sut.incidents[1].IncidentId;
		sut.id = id;
		const subscription = alertService.getAlerts().subscribe(
			(alertMsg: Alerts) => {
				expect( alertMsg ).toBeTruthy( );
		}, ( error ) => {
			fail( 'delete error, failed: ' + error );
		});
		sut.deleteItem( );
		//
	}));
	/*
	** deleteItemClicked( item: Incident ) :boolean
	*/
	it('should delete row when event called and OK is clicked...', fakeAsync(() => {
		//
		const delRow: Incident = sut.incidents[ 2 ];
		const delId: number = delRow.IncidentId;
		const expected: number = sut.incidents.length - 1;
		incidentServiceSpy.deleteIncident.and.returnValue(of( 1 ));
		spyOn(confirmService, 'confirm').and.callFake(
			(confirmation: Confirmation) => {
				return confirmation.accept();
			});
		const ret: boolean = sut.deleteItemClicked( delRow );
		expect( ret ).toEqual( false );
		tick(1000); // give it small amount of time
		sut.windowDisplay = false;
		expect( sut.incidents.length ).toBe( expected );
		console.log(
			'End of IncidentGridComponent ...\n' +
			'===================================' );
		//
	}));
	//
} );
// ===========================================================================
