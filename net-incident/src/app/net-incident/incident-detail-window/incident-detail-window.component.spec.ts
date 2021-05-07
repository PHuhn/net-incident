// ===========================================================================
import { ComponentFixture, TestBed, inject, fakeAsync, tick, getTestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
//
import { Observable, of, throwError } from 'rxjs';
//
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { FocusTrapModule } from 'primeng/focustrap';
import { ConfirmationService, SelectItem } from 'primeng/api';
//
import { BaseCompService } from '../../common/base-comp/base-comp.service';
import { Message } from '../../global/alerts/message';
import { AlertsService } from '../../global/alerts/alerts.service';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
import { ServicesService } from '../services/services.service';
// import { ServicesServiceMock } from '../services/mocks/ServicesService.mock';
import { NetworkIncidentService } from '../services/network-incident.service';
import { NetworkIncidentServiceMock } from '../services/mocks/NetworkIncidentService.mock';
//
import { DetailWindowInput } from '../DetailWindowInput';
import { IIncident, Incident } from '../incident';
import { NetworkIncident } from '../network-incident';
import { INetworkLog, NetworkLog } from '../network-log';
import { IUser, User } from '../user';
import { ServerData } from '../server-data';
import { SelectItemClass } from '../../global/select-item-class';
//
import { TruncatePipe } from '../../global/truncate.pipe';
import { NetworkIncidentSave } from '../network-incident-save';
import { IncidentDetailWindowComponent } from './incident-detail-window.component';
import { NetworkLogGridComponent } from '../network-log-grid/network-log-grid.component';
import { IncidentNoteGridComponent } from '../incident-note-grid/incident-note-grid.component';
import { IncidentNoteDetailWindowComponent } from '../incident-note-detail-window/incident-note-detail-window.component';
//
fdescribe( 'IncidentDetailWindowComponent', ( ) => {
	let sut: IncidentDetailWindowComponent;
	let fixture: ComponentFixture<IncidentDetailWindowComponent>;
	let alertService: AlertsService;
	let baseService: BaseCompService;
	let consoleService: ConsoleLogService;
	// let servicesServiceMock: ServicesServiceMock;
	let netIncidentService: NetworkIncidentServiceMock;
	let detailWindow: DetailWindowInput;
	//
	const servicesServiceSpy = jasmine.createSpyObj(
		'ServicesService', ['getPing', 'getWhoIs']);
	const whoisMockData_17_142_171_7: string =
		`[Querying whois.arin.net]\r\n[whois.arin.net]\r\n\r\n#\r\nNetRange:       17.0.0.0 - 17.255.255.255\r\nCIDR:           17.0.0.0/8\r\nNetName:        APPLE-WWNET\r\nOrganization:   Apple Inc. (APPLEC-1-Z)\r\n \r\nOrgName:        Apple Inc.\r\nOrgId:          APPLEC-1-Z\r\nOrgAbuseHandle: APPLE11-ARIN\r\nOrgAbuseName:   Apple Abuse\r\nOrgAbusePhone:  +1-408-974-7777 \r\nOrgAbuseEmail:  abuse@apple.com\r\n#`;
	//
	const testDate: Date = new Date('2000-01-01T00:00:00-05:00');
	//
	const ip: string = '192.199.1.1';
	const startDate: Date = new Date('2018-03-11T02:00:00-05:00');
	const endDate: Date = new Date('2018-11-04T02:00:00-05:00');
	const server = new ServerData(
		1, 1, 'NSG', 'Srv 1', 'Members Web-site',
		'Web-site', 'Web-site address: www.nsg.com',
		'We are in Michigan, USA.', 'Phil Huhn', 'Phil', 'PhilHuhn@yahoo.com',
		'EST (UTC-5)', true,  'EDT (UTC-4)', startDate, endDate
	);
	const user: User = new User('e0-01','U1','U','N','U N','U','UN1@yahoo.com',true,'734-555-1212', true,1,
		[new SelectItemClass('srv 1','Server 1'), new SelectItemClass('srv 2','Server 2')],'srv 1', server, ['admin']);
	//
	const mockData: Incident =
		new Incident( 4,1,ip,'arin.net','i-4-net','a@1.com','',false,false,false,'i 4',testDate );
	//
	const mockNetLogs = [
		new NetworkLog( 1,1,null,'192.1',new Date( '2018-02-27T00:00:00-05:00' ),'Log 1',1, 'SQL', false ),
		new NetworkLog( 2,1,null,'192.2',new Date( '2018-02-27T00:00:00-05:00' ),'Log 2',1, 'SQL', false ),
		new NetworkLog( 3,1,null,'192.3',new Date( '2018-02-27T00:00:00-05:00' ),'Log 3',1, 'SQL', false ),
		new NetworkLog( 4,1,null,ip,new Date( '2018-02-27T00:00:00-05:00' ),'Log 4',1, 'SQL', true ),
		new NetworkLog( 5,1,null,'192.5',new Date( '2018-02-27T00:00:00-05:00' ),'Log 5',1, 'SQL', false ),
		new NetworkLog( 6,1,null,'192.5',new Date( '2018-02-27T00:00:00-05:00' ),'Log 6',1, 'SQL', false )
	];
	const mockNICs: SelectItem[] = [
		{ value: 'afrinic.net' }, { value: 'apnic.net' },
		{ value: 'arin.net' }, { value: 'hostwinds.com' },
		{ value: 'jpnic.net' }, { value: 'lacnic.net' },
		{ value: 'nic.br' }, { value: 'other' },
		{ value: 'ripe.net' }, { value: 'twnic.net' },
		{ value: 'unknown' }
	];
	//
	beforeEach( waitForAsync( ( ) => {
		TestBed.configureTestingModule(  {
			imports: [ FormsModule,
				ButtonModule,
				TableModule,
				DropdownModule,
				FocusTrapModule,
				BrowserAnimationsModule
			],
			declarations: [
				IncidentDetailWindowComponent,
				IncidentDetailWindowComponent,
				NetworkLogGridComponent,
				IncidentNoteGridComponent,
				IncidentNoteDetailWindowComponent,
				TruncatePipe,
				Dialog
			],
			providers: [
				BaseCompService,
				AlertsService,
				ConsoleLogService,
				ConfirmationService,
				{ provide: ServicesService, useValue: servicesServiceSpy },
				// { provide: ServicesService, useClass: ServicesServiceMock },
				{ provide: NetworkIncidentService, useClass: NetworkIncidentServiceMock },
			]
		});
		// Setup injected pre service for each test
		baseService = TestBed.inject( BaseCompService );
		alertService = baseService._alerts;
		consoleService = baseService._console;
		// servicesServiceMock = TestBed.get( ServicesService );
		netIncidentService  = TestBed.get( NetworkIncidentService );
		TestBed.compileComponents( );
	}));
	//
	beforeEach( waitForAsync( ( ) => {
		fixture = TestBed.createComponent( IncidentDetailWindowComponent );
		sut = fixture.componentInstance;
		//
		const response: NetworkIncident = newNetworkIncident( mockData );
		netIncidentService.mockGet = response;
		// supply the input data
		detailWindow = new DetailWindowInput( user, mockData );
		sut.detailWindowInput = detailWindow;
		sut.displayWin = true;
		//
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
	} ) );
	//
	function newNetworkIncident( incident: Incident ): NetworkIncident {
		const _ni = new NetworkIncident( );
		_ni.incident = JSON.parse( JSON.stringify( incident ) );
		_ni.incidentNotes = [];
		_ni.deletedNotes = [];
		_ni.networkLogs = JSON.parse( JSON.stringify( mockNetLogs ) );
		_ni.deletedLogs = [];
		_ni.typeEmailTemplates = [];
		_ni.NICs = mockNICs;
		_ni.incidentTypes = [];
		_ni.noteTypes = [];
		_ni.message = '';
		_ni.user = undefined;
		return _ni;
	}
	/*
	** Cleanup so no dialog window will still be open
	*/
	function windowCleanup( ) {
		sut.detailWindow = undefined;
		sut.displayWindow = false;
		tickFakeWait( 1 );
	}
	/*
	** Pause for events to process.
	*/
	function tickFakeWait( ticks: number ) {
		tick( ticks );
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
	}
	//
	// Component is instantiated
	//
	it( 'should be created ...', fakeAsync( ( ) => {
		console.log(
			'===================================\n' +
			'IncidentDetailWindowComponent should create ...' );
		expect( sut ).toBeTruthy( );
		windowCleanup( );
	} ) );
	//
	// Verify data is transmitted to model via @input statement
	//
	it( 'should get the mock data...', fakeAsync( ( ) => {
		//
		tickFakeWait( 1 );
		fixture.whenStable().then(() => {
			expect( sut.networkIncident.incident.IncidentId ).toEqual( mockData.IncidentId );
			expect( sut.networkIncident.incident.ServerId ).toEqual( mockData.ServerId );
			expect( sut.networkIncident.incident.NIC ).toEqual( mockData.NIC );
			expect( sut.networkIncident.incident.NetworkName ).toEqual( mockData.NetworkName );
			expect( sut.networkIncident.incident.AbuseEmailAddress ).toEqual( mockData.AbuseEmailAddress );
			expect( sut.networkIncident.incident.ISPTicketNumber ).toEqual( mockData.ISPTicketNumber );
			expect( sut.networkIncident.incident.Mailed ).toEqual( mockData.Mailed );
			expect( sut.networkIncident.incident.Closed ).toEqual( mockData.Closed );
			expect( sut.networkIncident.incident.Special ).toEqual( mockData.Special );
			expect( sut.networkIncident.incident.Notes ).toEqual( mockData.Notes );
			windowCleanup( );
		});
		//
	} ) );
	//
	// initialize( model: IIncident ): void
	//
	it('initialize: should set undefined string fields ...', fakeAsync( ( ) => {
		//
		// given
		// model.IPAddress = '';
		// model.NIC = '';
		// model.NetworkName = '';
		// model.AbuseEmailAddress = '';
		// model.ISPTicketNumber = '';
		// model.Notes = '';
		const incident: IIncident =
			new Incident( 76, 1, undefined, undefined, undefined, undefined, undefined, false, false, false, undefined, new Date( '2021-06-06' ) );
		// when
		sut.initialize( incident );
		// then
		expect( incident.IPAddress ).toEqual( '' );
		expect( incident.NIC ).toEqual( '' );
		expect( incident.NetworkName ).toEqual( '' );
		expect( incident.AbuseEmailAddress ).toEqual( '' );
		expect( incident.ISPTicketNumber ).toEqual( '' );
		expect( incident.Notes ).toEqual( '' );
		windowCleanup( );
		//
	} ) );
	//
	// validate( ): boolean
	//
	it('validate: should display alert when invalid ...', fakeAsync( ( ) => {
		//
		// given
		const save = new NetworkIncidentSave()
		save.incident =
			new Incident( 76, 1, undefined, undefined, undefined, undefined, undefined, false, false, false, undefined, new Date( '2021-06-06' ) );
		save.incidentNotes = [];
		save.deletedNotes = [];
		save.networkLogs = [];
		save.deletedLogs = [];
		save.user = { ... user };
		save.message = '';
		sut.networkIncidentSave = save;
		spyOn( alertService, 'warningSet' );
		// when
		sut.validate( );
		// then
		expect( alertService.warningSet ).toHaveBeenCalled( );
		windowCleanup( );
		//
	} ) );
	//
	// validateUser( errMsgs: Message[], model: IUser ): void
	//
	it('validateUser: should display alert when invalid ...', fakeAsync( ( ) => {
		//
		// given
		let errMsgs: Message[] = [];
		const badUser = { ... user };
		badUser.UserName = '';
		badUser.UserNicName = '';
		badUser.Email = '';
		// when
		sut.validateUser( errMsgs, badUser );
		// then
		expect( errMsgs.length ).toEqual( 3 );
		windowCleanup( );
		//
	} ) );
	/*
	** ipChanged( ipAddress: string ): void
	*/
	it('ipChanged: should lookup the new ip address ...', fakeAsync( ( ) => {
		//
		// given
		const testData: Incident = { ... mockData };
		sut.networkIncident = newNetworkIncident( testData );
		servicesServiceSpy.getWhoIs.and.returnValue( of( whoisMockData_17_142_171_7 ) );
		// when
		sut.ipChanged( '17.142.171.7' );
		// then
		tickFakeWait( 1 );
		// console.log( `: ${sut.networkIncident.incident.NIC} ${sut.networkIncident.incident.AbuseEmailAddress} ${sut.networkIncident.incident.NetworkName}` );
		expect( sut.networkIncident.incident.NIC ).toEqual( 'arin.net' );
		expect( sut.networkIncident.incident.AbuseEmailAddress ).toEqual( 'abuse@apple.com' );
		expect( sut.networkIncident.incident.NetworkName ).toEqual( 'APPLE-WWNET' );
		windowCleanup( );	// window launched in beforeEach
		tickFakeWait( 1000 );
		//
	} ) );
	/*
	** newNoteId(): number
	*/
	it('newNoteId: should create new negative id ...', fakeAsync( ( ) => {
		//
		// given
		// when
		const ret: number = sut.newNoteId( );
		// then
		expect( ret ).toEqual( -2 );
		windowCleanup( );	// window launched in beforeEach
		//
	} ) );
	/*
	** Simulate a button clicked, call windowClose directly with the default data.
	*/
	it('should update class when updateItem called ...', fakeAsync( ( ) => {
		//
		netIncidentService.mockCrudResponse = new HttpResponse(
				{ status: 201, statusText: 'OK' } );
		sut.onClose.subscribe( saved => {
			sut.displayWin = false;
			expect( saved ).toBe( true );
		} );
		sut.windowClose( true );
		windowCleanup( );
		//
	} ) );
	//
	// Simulate a button clicked, call directly windowClose for createItem
	//
	it('should create NetworkIncident class when createItem called ...', fakeAsync( () => {
		//
		const id = 0;
		const empty: Incident = new Incident( 0,1,'','','','','',false,false,false,'',testDate );
		sut.detailWindowInput = new DetailWindowInput( user, empty );
		//
		const createIncident = new Incident(
			id, // IncidentId: number,
			1, // ServerId: number,
			'10.1.1.1',  // IPAddress: string,
			'ripe.net', // NIC: string,
			'ru.net', // NetworkName: string,
			'abuse@ru.net', // AbuseEmailAddress: string,
			'', // ISPTicketNumber: string,
			false, // Mailed: boolean,
			false, // Closed: boolean,
			false, // Special: boolean,
			'Create', // Notes: string,
			new Date(Date.now()) // CreatedDate: Date,
		);
		const response: NetworkIncident = newNetworkIncident( createIncident );
		netIncidentService.mockGet = response;
		netIncidentService.mockCrudResponse = response;
		createIncident.IncidentId = 0;
		sut.networkIncident.incident = createIncident;
		sut.windowClose( true );
		//
		tickFakeWait( 1000 );
		tickFakeWait( 1000 );
		//
		expect( sut.networkIncident.incident.IncidentId ).toBe( id );
		sut.displayWin = false;
		windowCleanup( );
		//
	} ) );
	//
	// Simulate a cancel button clicked, call directly windowClose
	//
	it('should emit when canceled ...', fakeAsync( () => {
		//
		sut.onClose.subscribe( saved => {
			sut.displayWin = false;
			expect( saved ).toBe( false );
		} );
		sut.windowClose( false );
		//
		windowCleanup( );
		//
		console.log(
			'End of IncidentDetailWindowComponent.spec\n' +
			'===================================' );
	} ) );
	//
} );
// ===========================================================================
