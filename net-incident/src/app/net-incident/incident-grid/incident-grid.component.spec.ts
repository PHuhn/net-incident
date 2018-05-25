// ===========================================================================
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick, discardPeriodicTasks, getTestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable, throwError, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { By } from '@angular/platform-browser';
import { HttpResponse } from '@angular/common/http';
//
import { DataTableModule } from '../../../../node_modules/primeng/components/datatable/datatable'; //primeng/components/datatable/datatable';
import { DataTable } from '../../../../node_modules/primeng/components/datatable/datatable';
import { Dialog } from '../../../../node_modules/primeng/components/dialog/dialog';
import { ConfirmDialog } from '../../../../node_modules/primeng/components/confirmdialog/confirmdialog';
import { Header, Footer } from '../../../../node_modules/primeng/components/common/shared';
import { ButtonModule } from '../../../../node_modules/primeng/components/button/button';
import { ConfirmationService } from '../../../../node_modules/primeng/components/common/confirmationservice';
import { SelectItem } from '../../../../node_modules/primeng/components/common/selectitem';
import { Dropdown, DropdownModule } from '../../../../node_modules/primeng/components/dropdown/dropdown';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { ServicesService } from '../services/services.service';
import { ServicesServiceMock } from '../services/mocks/ServicesService.mock';
import { UserService } from '../../net-incident/services/user.service';
import { UserServiceMock } from '../services/mocks/UserService.mock';
import { IncidentService } from '../services/incident.service';
import { IncidentServiceMock } from '../services/mocks/IncidentService.mock';
import { NetworkIncidentService } from '../services/network-incident.service';
import { NetworkIncidentServiceMock } from '../services/mocks/NetworkIncidentService.mock';
import { ConfirmationServiceMock } from '../services/mocks/ConfirmationService.mock';
//
import { TruncatePipe } from '../../global/truncate.pipe'
import { DetailWindowInput } from '../DetailWindowInput';
import { IUser, User } from '../user';
import { ServerData } from '../server-data';
import { SelectItemClass } from '../select-item-class';
import { IIncident, Incident } from '../incident';
import { INetworkLog, NetworkLog } from '../network-log';
import { NetworkIncident } from '../network-incident';
import { IncidentGridComponent } from './incident-grid.component';
import { IncidentDetailWindowComponent } from '../incident-detail-window/incident-detail-window.component';
import { ServerSelectionWindowComponent } from '../../net-incident/server-selection-window/server-selection-window.component';
import { NetworkLogGridComponent } from '../network-log-grid/network-log-grid.component'
import { IncidentNoteGridComponent } from '../incident-note-grid/incident-note-grid.component';
import { IncidentNoteDetailWindowComponent } from '../incident-note-detail-window/incident-note-detail-window.component';
import { AppComponent } from '../../app.component';
import { Security } from '../security';
//
describe( 'IncidentGridComponent', ( ) => {
	let sut: IncidentGridComponent;
	let fixture: ComponentFixture<IncidentGridComponent>;
	let alertService: AlertsService;
	let userServiceMock: UserServiceMock;
	let servicesServiceMock: ServicesServiceMock;
	let incidentServiceMock: IncidentServiceMock;
	let confirmService: ConfirmationServiceMock;
	let networkIncidentServiceMock: NetworkIncidentServiceMock;
	let detailWindow: DetailWindowInput;
	let expectedWindowTitle: string = 'Incident Detail';
	let windowTitleSelector: string =
		'app-incident-detail-window > p-dialog > div > div.ui-dialog-titlebar > span > p-header > div';
	let testDate: Date = new Date('2000-01-01T00:00:00');
	let startDate: Date = new Date('2018-03-11T02:00:00');
	let endDate: Date = new Date('2018-11-04T02:00:00');
	let server = new ServerData(
		1, 1, 'NSG', 'Srv 1', 'Members Web-site',
		'Web-site', 'Web-site address: www.nsg.com',
		'We are in Michigan, USA.', 'Phil Huhn', 'Phil', 'PhilHuhn@yahoo.com',
		'EST (UTC-5)', true,  'EDT (UTC-4)', startDate, endDate
	);
	let user: User = new User('e0-01','U1','U','N','U N','U','UN1@yahoo.com',true,'734-555-1212', true,1,
		[new SelectItemClass('srv 1','Server 1'), new SelectItemClass('srv 2','Server 2')],'srv 1', server,['admin']);
	//
	const mockDatum = [
		new Incident( 1,1,'193.1','arin.net','i 1','i1@1.com','',true,true,true,'',testDate ),
		new Incident( 2,1,'193.2','ripe.net','i 2','i2@2.com','',false,false,false,'Note 2',testDate ),
		new Incident( 3,1,'193.3','ripe.net','i 3','i3@3.com','',true,true,true,'',testDate ),
		new Incident( 4,1,'193.4','ripe.net','i 4','i4@4.com','',false,false,false,'Note 4',testDate ),
		new Incident( 5,1,'193.5','ripe.net','i 5','i5@5.com','',true,true,true,'',testDate ),
		new Incident( 6,2,'193.6','arin.net','i 6','i6@6.com','',false,false,false,'',testDate )
	];
	const mockLogs = [
		new NetworkLog( 1,1,null,'192.1',new Date( '2018-02-27T00:00:00' ),'Log 1',1, 'SQL', false ),
		new NetworkLog( 2,1,null,'192.2',new Date( '2018-02-27T00:00:00' ),'Log 2',1, 'SQL', false ),
		new NetworkLog( 3,1,null,'192.3',new Date( '2018-02-27T00:00:00' ),'Log 3',1, 'SQL', false ),
		new NetworkLog( 4,1,null,'192.4',new Date( '2018-02-27T00:00:00' ),'Log 4',1, 'SQL', false ),
		new NetworkLog( 5,1,null,'192.5',new Date( '2018-02-27T00:00:00' ),'Log 5',1, 'SQL', false ),
		new NetworkLog( 6,1,null,'192.5',new Date( '2018-02-27T00:00:00' ),'Log 6',1, 'SQL', false )
	];
	let selectItemsWindow: SelectItem[] = user.ServerShortNames;
	let displayServersWindow: boolean = false;
	//
	beforeEach( async( ( ) => {
		TestBed.configureTestingModule(  {
			imports: [ 
				FormsModule,
				DataTableModule,
				ButtonModule,
				DropdownModule,
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
				{ provide: UserService, useClass: UserServiceMock },
				{ provide: ServicesService, useClass: ServicesServiceMock },
				{ provide: IncidentService, useClass: IncidentServiceMock },
				{ provide: NetworkIncidentService, useClass: NetworkIncidentServiceMock },
				{ provide: ConfirmationService, useClass: ConfirmationServiceMock }
			]
		});
		alertService = TestBed.get( AlertsService );
		userServiceMock = TestBed.get( UserService );
		servicesServiceMock = TestBed.get( ServicesService );
		confirmService =  TestBed.get( ConfirmationService );
		incidentServiceMock = TestBed.get( IncidentService );
		networkIncidentServiceMock = TestBed.get( NetworkIncidentService );
		TestBed.compileComponents( );
	}));
	//
	beforeEach( async( ( ) => {
		fixture = TestBed.createComponent( IncidentGridComponent );
		sut = fixture.componentInstance;
		// push in the @Input
		sut.user = user;
		AppComponent.securityManager = new Security( user );
		// clone the array with slice( 0 )
		incidentServiceMock.mockGetAll = mockDatum.slice( 0 )
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
	} ) );
	//
	afterEach(() => {
		//
	});
	//
	function newNetworkIncident( incident: Incident ): NetworkIncident {
		let _ni = new NetworkIncident( );
		_ni.incident = incident;
		_ni.incidentNotes = [];
		_ni.deletedNotes = [];
		_ni.networkLogs = mockLogs;
		_ni.deletedLogs = [];
		_ni.typeEmailTemplates = [];
		_ni.NICs = [];
		_ni.incidentTypes = [];
		_ni.noteTypes = [];
		_ni.message = '';
		_ni.user = undefined;
		return _ni;
	}
	//
	//	Component instantiates
	//
	it( 'should be created ...', async( () => {
		console.log(
			'===================================\n' +
			'IncidentGridComponent should create ...' );
		expect( sut ).toBeTruthy( );
	} ) );
	//
	//	getIncidents( ) : Observable<IIncident[]>
	//
	it('should initialize with all data...', fakeAsync( () => {
		console.log( 'begin of all data' );
		expect( sut.incidents.length ).toBe( 6 );
		//
		expect( sut.incidents[ 0 ].IncidentId ).toEqual( 1 );
		expect( sut.incidents[ 1 ].IncidentId ).toEqual( 2 );
		expect( sut.incidents[ 2 ].IncidentId ).toEqual( 3 );
		expect( sut.incidents[ 3 ].IncidentId ).toEqual( 4 );
		expect( sut.incidents[ 4 ].IncidentId ).toEqual( 5 );
		expect( sut.incidents[ 5 ].IncidentId ).toEqual( 6 );
		console.log( 'end of all data' );
	}));
	//
	//	addItemClicked( )
	//
	it('should launch window when addItemClicked is called ...', fakeAsync( () => {
		console.log( 'addItemClicked is called ...' );
		let response: NetworkIncident = newNetworkIncident(
			new Incident( 0,1,'','','','','',false,false,false,'',testDate )
		);
		let id = response.incident.IncidentId; // for title
		let ip = '';
		networkIncidentServiceMock.mockGet = response;
		sut.addItemClicked( );
		expect( sut.windowDisplay ).toEqual( true );
		let title: HTMLDivElement = fixture.debugElement.query(By.css(
			'#IncidentDetailWindowHeader' )).nativeElement;
		expect( title.innerText.trim( ) ).toEqual( `Incident Detail: ${id}, IP Address:` );
		sut.windowDisplay = false;
	}));
	//
	//	editItemClicked( )
	//
	it('should launch detail window when editItemClicked is called ...', async( () => {
		console.log( 'editItemClicked ...' );
		let incident: Incident = sut.incidents[ 2 ];
		let response: NetworkIncident = newNetworkIncident( incident );
		let id = response.incident.IncidentId; // for title
		let ip = response.incident.IPAddress;
		networkIncidentServiceMock.mockGet = response;
		sut.editItemClicked( incident );
		//
		console.log( `~= ${new Date().toISOString()}` )
		//
		let cnt: number = 0;
		// https://stackoverflow.com/questions/50200859/i-dont-get-rxjs-6-with-angular-6-with-interval-switchmap-and-map
		interval( 100 ).pipe(takeWhile(val => cnt < 4)).subscribe(val => {
			// timing issues, all have to complete:
			//  getNetIncident (to get complete data)
			//  incident-note-grid
			//  incident-note-detail-window
			//  network-log-grid
			cnt++;
			fixture.detectChanges()
			fixture.whenStable();
			if( sut.windowDisplay  === true ) {
				expect( sut.windowDisplay ).toEqual( true );
				let title: HTMLDivElement = fixture.debugElement.query(By.css(
					'#IncidentDetailWindowHeader' )).nativeElement;
				expect( title.innerText.trim( ) ).toEqual( `Incident Detail: ${id}, IP Address: ${ip}` );
				sut.windowDisplay = false;
				console.log( `~=* detail completed ${new Date().toISOString()}` )
				cnt = 4;
			} else {
				if ( cnt === 4 ) fail('Detail window took too long.');
			}
		});
	}));
	it('should launch take While ...', async( () => {
		console.log( 'editItemClicked 2 ...' );
		console.log( `~= ${new Date().toISOString()}` )
		//
		let cnt: number = 0;
		// https://stackoverflow.com/questions/50200859/i-dont-get-rxjs-6-with-angular-6-with-interval-switchmap-and-map
		interval( 100 ).pipe(takeWhile(val => cnt < 4)).subscribe(val => {
			cnt++;
			console.log( `~=* ${val} ${cnt} ${new Date().toISOString()}` )
		});
	}));
	//
	//	deleteItemClicked( item: Incident ) :boolean
	//
	it('should delete row when event called and OK is clicked...', fakeAsync(() => {
		//
		console.log( 'deleteItemClicked ...' );
		incidentServiceMock.mockCrudResponse =
			new HttpResponse( { status: 204, statusText: 'OK' } );
		const id: number = sut.incidents[ 3 ].IncidentId;
		let ret: Boolean = sut.deleteItemClicked( sut.incidents[ 3 ] );
		confirmService.accept();
		expect( ret ).toEqual( false );
		tick( 10 );
		// give it very small amount of time
		expect( incidentServiceMock.mockDeleteId ).toBe( id );
		//
		console.log(
			'End of IncidentGridComponent ...\n' +
			'===================================' );
		//
	}));
	//
} );
// ===========================================================================
