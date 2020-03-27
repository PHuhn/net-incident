// ===========================================================================
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
//
import { Observable, throwError } from 'rxjs';
//
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { Header, Footer, ConfirmationService } from 'primeng/api';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { ServicesService } from '../services/services.service';
import { ServicesServiceMock } from '../services/mocks/ServicesService.mock';
import { NetworkIncidentService } from '../services/network-incident.service';
import { NetworkIncidentServiceMock } from '../services/mocks/NetworkIncidentService.mock';
import { ConfirmationServiceMock } from '../services/mocks/ConfirmationService.mock';
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
import { IncidentDetailWindowComponent } from './incident-detail-window.component';
import { NetworkLogGridComponent } from '../network-log-grid/network-log-grid.component';
import { IncidentNoteGridComponent } from '../incident-note-grid/incident-note-grid.component';
import { IncidentNoteDetailWindowComponent } from '../incident-note-detail-window/incident-note-detail-window.component';
//
describe( 'IncidentDetailWindowComponent', ( ) => {
	let sut: IncidentDetailWindowComponent;
	let fixture: ComponentFixture<IncidentDetailWindowComponent>;
	let alertService: AlertsService;
	let servicesServiceMock: ServicesServiceMock;
	let confirmService: ConfirmationServiceMock;
	let netIncidentService: NetworkIncidentServiceMock;
	let detailWindow: DetailWindowInput;
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
	//
	beforeEach( async( ( ) => {
		TestBed.configureTestingModule(  {
			imports: [ FormsModule,
				ButtonModule,
				TableModule,
				DropdownModule,
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
				AlertsService,
				{ provide: ServicesService, useClass: ServicesServiceMock },
				{ provide: NetworkIncidentService, useClass: NetworkIncidentServiceMock },
				{ provide: ConfirmationService, useClass: ConfirmationServiceMock }
			]
		});
		alertService =        TestBed.get( AlertsService );
		servicesServiceMock = TestBed.get( ServicesService );
		confirmService =      TestBed.get( ConfirmationService );
		netIncidentService  = TestBed.get( NetworkIncidentService );
		TestBed.compileComponents( );
	}));
	//
	beforeEach( async( ( ) => {
		fixture = TestBed.createComponent( IncidentDetailWindowComponent );
		sut = fixture.componentInstance;
		//
		const response: NetworkIncident = newNetworkIncident( mockData );
		netIncidentService.mockGet = response;
		// supply the input data
		detailWindow = new DetailWindowInput( user, mockData );
		sut.detailWindowInput = detailWindow;
		sut.displayWin = true;
		console.log( `*=* beforeEach ${new Date().toISOString()}` );
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
		_ni.NICs = [];
		_ni.incidentTypes = [];
		_ni.noteTypes = [];
		_ni.message = '';
		_ni.user = undefined;
		return _ni;
	}
	//
	// Component is instantiated
	//
	it( 'should be created ...', fakeAsync( ( ) => {
		console.log(
			'===================================\n' +
			'IncidentDetailWindowComponent should create ...' );
		expect( sut ).toBeTruthy( );
	} ) );
	//
	// Verify data is transmitted to model via @input statement
	//
	it( 'should get the mock data...', async( ( ) => {
		//
		console.log(
			'***********************************' );
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			console.log( `mock data, display win: ${sut.displayWindow}  ${new Date().toISOString()}` );
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
		});
		//
	} ) );
	//
	// Simulate a button clicked, call windowClose directly with the default data.
	//
	it('should update class when updateItem called ...', fakeAsync( ( ) => {
		//
		netIncidentService.mockCrudResponse = new HttpResponse(
				{ status: 201, statusText: 'OK' } );
		sut.onClose.subscribe( saved => {
			console.log( 'In onClose callback updateItem ...' );
			sut.displayWin = false;
			expect( saved ).toBe( true );
		} );
		sut.windowClose( true );
		//
	} ) );
	//
	// Simulate a button clicked, call directly windowClose for createItem
	//
	it('should create NetworkIncident class when createItem called ...', async( () => {
		//
		console.log( `Create NetworkIncident class when createItem called: ${new Date().toISOString()}` );
		const id = 100;
		sut.logLevel = 3;
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
		console.log( response );
		netIncidentService.mockGet = response;
		netIncidentService.mockCrudResponse = response;
		createIncident.IncidentId = 0;
		console.log( createIncident );
		sut.networkIncident.incident = createIncident;
		sut.windowClose( true );
		//
		console.log( `~= windowClose: ${new Date().toISOString()}` );
		fixture.detectChanges();
		fixture.whenStable();
		console.log( `~=* windowClose: ${new Date().toISOString()}` );
		//
		expect( sut.networkIncident.incident.IncidentId ).toBe( id );
		sut.displayWin = false;
		//
	} ) );
	//
	// Simulate a cancel button clicked, call directly windowClose
	//
	it('should emit when canceled ...', async( () => {
		//
		sut.onClose.subscribe( saved => {
			console.log( 'In onClose callback cancel ...' );
			sut.displayWin = false;
			expect( saved ).toBe( false );
		} );
		sut.windowClose( false );
		//
		fixture.detectChanges();
		fixture.whenStable();
		//
		console.log(
			'End of IncidentDetailWindowComponent.spec\n' +
			'===================================' );
	} ) );
	//
} );
// ===========================================================================
