// ===========================================================================
import { ComponentFixture, TestBed, getTestBed, inject, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
//
import { HttpClientModule, HttpClient, HttpResponse, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
//
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { FocusTrapModule } from 'primeng/focustrap';
import { Header, Footer, ConfirmationService, SelectItem } from 'primeng/api';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { Alerts } from '../../global/alerts/alerts';
import { AlertLevel } from '../../global/alerts/alert-level.enum';
import { Message } from '../../global/alerts/message';
import { ServicesService } from '../services/services.service';
import { ServicesServiceMock } from '../services/mocks/ServicesService.mock';
import { ConfirmationServiceMock } from '../services/mocks/ConfirmationService.mock';
import { SelectItemClass } from '../../global/select-item-class';
import { IIncident, Incident } from '../incident';
import { NetworkIncident } from '../network-incident';
import { NetworkLog } from '../network-log';
import { ServerData } from '../server-data';
import { User } from '../user';
import { IIncidentNote, IncidentNote } from '../incident-note';
import { IncidentNoteDetailWindowComponent } from './incident-note-detail-window.component';
//
describe( 'IncidentNoteDetailWindowComponent', ( ) => {
	let sut: IncidentNoteDetailWindowComponent;
	let fixture: ComponentFixture<IncidentNoteDetailWindowComponent>;
	let alertService: AlertsService;
	const incidentnoteServiceSpy = jasmine.createSpyObj(
		'IncidentNoteService', ['emptyIncidentNote', 'validate', 'getIncidentNote', 'createIncidentNote', 'updateIncidentNote']);
	const servicesServiceSpy = jasmine.createSpyObj(
		'ServicesService', ['getPing', 'getWhoIs']);
	let servicesService: ServicesService;
	let confirmationService = ConfirmationService;
	const startDate: Date = new Date('2018-03-11T02:00:00');
	const endDate: Date = new Date('2018-11-04T02:00:00');
	const standardDate: Date = new Date('2018-03-10T23:00:00');
	const daylightDate: Date = new Date('2018-03-11T02:01:00');
	//
	const serverMock = new ServerData(
		1, 1, 'NSG', 'Srv 1', 'Members Web-site',
		'Web-site', 'Web-site address: www.nsg.com',
		'We are in Michigan, USA.', 'User Admin', 'Admin', 'ServerAdmin@yahoo.com',
		'EST (UTC-5)', true,  'EDT (UTC-4)', startDate, endDate
	);
	//
	const userMock = new User('e0-04','Head','Head','Admin','Head Admin','U','UN4@yahoo.com',
		true,'734-555-1212', true,1, [new SelectItemClass('srv 1','Server 1')],'srv 1',serverMock, ['admin']);
	//
	const ipAddr: string = '192.169.1.1';
	//
	let mockData: IncidentNote;
	//
	const mockDatum = [
		new IncidentNote( 1,1,'Ping','i 1',new Date( '2018-01-01T00:00:00' ), false ),
		new IncidentNote( 2,2,'Whois','i 2',new Date( '2018-01-02T00:00:00' ), false ),
		new IncidentNote( 3,3,'ISP Rpt','i 3',new Date( '2018-01-03T00:00:00' ), false ),
		new IncidentNote( 4,1,'Ping','i 4',new Date( '2018-01-04T00:00:00' ), false ),
		new IncidentNote( 5,2,'Whois','i 5',new Date( '2018-01-05T00:00:00' ), false ),
		new IncidentNote( 6,3,'ISP Rpt','i 6',new Date( '2018-01-06T00:00:00' ), false )
	];
	const noteTypes: SelectItem[] = [
		new SelectItemClass( 1, 'Ping' ),
		new SelectItemClass( 2, 'WhoIs' ),
		new SelectItemClass( 3, 'ISP Rpt' ),
		new SelectItemClass( 4, 'ISP Addl' ),
		new SelectItemClass( 5, 'ISP Resp' )
	];
	//
	const inc: Incident = new Incident( 4,1,ipAddr,'arin.net','PSG169',
		'dandy@psg.com','',false,false,false,'',new Date( '2018-04-01T01:00:00' ) );
	const emptyData: IncidentNote =
		new IncidentNote( 0,0,'','',new Date( '2010-01-01T00:00:00' ) );
	//
	const netInc = new NetworkIncident();
	//
	beforeEach( waitForAsync( ( ) => {
		TestBed.configureTestingModule(  {
			imports: [ FormsModule,
				ButtonModule,
				FocusTrapModule,
				DropdownModule,
				BrowserAnimationsModule,
				// HttpClient 4.3 testing
				HttpClientModule,
				HttpClientTestingModule
			],
			declarations: [
				IncidentNoteDetailWindowComponent,
				Dialog
			],
			providers: [
				AlertsService,
				{ provide: ServicesService, useValue: servicesServiceSpy },
				{ provide: ConfirmationService, useClass: ConfirmationServiceMock }
			]
		});
		// Setup injected pre service for each test
		alertService = getTestBed().get( AlertsService );
		confirmationService = getTestBed().get( ConfirmationService );
		// Setup sut
		TestBed.compileComponents();
	}));
	//
	beforeEach( inject( [AlertsService], ( srvc: AlertsService ) => {
		alertService = srvc;
	} ) );
	//
	beforeEach( ( ) => {
		fixture = TestBed.createComponent( IncidentNoteDetailWindowComponent );
		sut = fixture.componentInstance;
		// pretend that it was wired to something that supplied a row
		const nl = new NetworkLog(99, serverMock.ServerId, inc.IncidentId, ipAddr, new Date( '2018-01-19T01:00:00' ), 'Fake log', 3, 'Type 3', true);
		netInc.incident = inc;
		netInc.networkLogs = [ nl ];
		netInc.deletedLogs = [];
		netInc.deletedNotes = [];
		netInc.incidentNotes = mockDatum;
		netInc.typeEmailTemplates = [];
		netInc.user = userMock;
		netInc.noteTypes = noteTypes;
		sut.networkIncident = netInc;
		mockData = mockDatum[3];
		sut.incidentnote = mockData;
		sut.displayWin = true;
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
	} );
	//
	// Component is instantiated
	//
	it( 'should be created ...', ( ) => {
		console.log(
			'===================================\n' +
			'IncidentNoteDetailWindowComponent should create ...' );
		expect( sut ).toBeTruthy( );
	} );
	//
	// Verify data is transmitted to model via @input statement
	//
	it( 'should get the mock data...', ( ) => {
		expect( sut.model.IncidentNoteId ).toEqual( mockData.IncidentNoteId );
		expect( sut.model.NoteTypeId ).toEqual( mockData.NoteTypeId );
		expect( sut.model.Note ).toEqual( mockData.Note );
		expect( sut.model.CreatedDate ).toEqual( mockData.CreatedDate );
	} );
	//
	// Call updateItem directly with the default data.
	//
	it('should update class when updateItem called ...', fakeAsync( ( ) => {
		//
		const response = new HttpResponse( { status: 201, statusText: 'OK' } );
		incidentnoteServiceSpy.updateIncidentNote.and.returnValue(of( response ));
		sut.onClose.subscribe( saved => {
			console.log( 'In onClose callback ...' );
			sut.displayWin = false;
			expect( saved ).toBe( true );
		} );
		sut.updateItem( );
		//
	} ) );
	//
	// Call directly createItem
	//
	it('should create class when createItem called ...', fakeAsync(() => {
		//
		const response = new HttpResponse( { status: 201, statusText: 'OK' } );
		sut.onClose.subscribe( saved => {
			console.log( 'In onClose callback ...' );
			sut.displayWin = false;
			expect( saved ).toBe( true );
		} );
		sut.incidentnote = emptyData;
		sut.model.IncidentNoteId = 5;
		sut.model.NoteTypeId = 3;
		sut.model.NoteTypeShortDesc = 'ISP Rpt';
		sut.model.Note = 'i 5';
		sut.model.CreatedDate = new Date( '2000-01-01T00:00:00' );
		incidentnoteServiceSpy.createIncidentNote.and.returnValue(of( response ));
		sut.createItem( );
		//
	} ) );
	//
	// Simulate a button clicked, by calling event method
	//
	it('should update class when save button clicked ...', fakeAsync(() => {
		//
		const response = new HttpResponse( { status: 204, statusText: 'OK' } );
		incidentnoteServiceSpy.validate.and.returnValue(of( [] ));
		incidentnoteServiceSpy.updateIncidentNote.and.returnValue(of( response ));
		sut.onClose.subscribe( saved => {
			console.log( 'In onClose callback ...' );
				sut.displayWin = false;
			expect( saved ).toBe( true );
		} );
		sut.windowClose( true );
		//
	} ) );
	//
	// (change)='onTypeIdDropdownChanged( $event )'
	//
	it('onTypeIdChanged: call the onChange event ...', fakeAsync(() => {
		//
		console.log( 'onTypeIdDropdownChanged' );
		const id: number = 4;
		sut.onTypeIdDropdownChanged(id);
		expect( sut.model.NoteTypeId ).toEqual( id );
		//
	} ) );
	//
	// (change)='onTypeIdDropdownChanged( $event )'
	//
	it('performIncidentType: call the onChange event ...', fakeAsync(() => {
		//
		console.log( 'performIncidentType' );
		const id: number = 1;
		sut.incidentnote = emptyData;
		const resp: string = `Pinging USA.NET [${ipAddr}] with 32 bytes of data:`;
		servicesServiceSpy.getPing.and.returnValue(of( resp ));
		sut.performIncidentType(id, 'ping');
		tick(1000);
		expect( sut.model.Note ).toEqual( resp );
		//
	} ) );
	//
	// Invoke the getPing server service
	//
	it('getPing: call the getPing server services ...', fakeAsync(() => {
		//
		console.log( 'get ping' );
		sut.incidentnote = emptyData;
		const resp: string = `Pinging USA.NET [${ipAddr}] with 32 bytes of data:`;
		servicesServiceSpy.getPing.and.returnValue(of( resp ));
		sut.getPing();
		tick(1000);
		expect( sut.model.Note ).toEqual( resp );
		sut.windowClose( false );
		//
	} ) );
	//
	// Invoke the getPing server service
	//
	it('getPing: call the getPing server services error ...', fakeAsync(() => {
		//
		console.log( 'get ping error' );
		const resp: HttpErrorResponse = new HttpErrorResponse({
			error: {}, status: 500, url: 'http://localhost', statusText: 'Bad Request' });
		servicesServiceSpy.getPing.and.returnValue(of( resp ));
		alertService.getAlerts().subscribe( (msg: Alerts) => {
			expect( msg ).toBeTruthy( );
			expect( msg.level ).toBe( AlertLevel.Error );
		}, error =>	{
			console.error( error );
			expect( 1 ).toEqual( 0 );
		});
		sut.getPing();
		sut.windowClose( false );
		//
	} ) );
	//
	// Invoke the getPing server service
	//
	it('getWhoIs: call the getWhoIs server services ...', fakeAsync(() => {
		//
		console.log( 'get whois' );
		sut.incidentnote = emptyData;
		const resp: string = `Abuse contact for '${ipAddr} - ${ipAddr}' is 'noc@usa.net'`;
		servicesServiceSpy.getWhoIs.and.returnValue(of( resp ));
		sut.getWhoIs();
		tick(1000);
		expect( sut.model.Note ).toEqual( resp );
		sut.windowClose( false );
		//
	} ) );
	//
	// Invoke the getPing server service
	//
	it('getReport: call getReport for current network incident ...', fakeAsync(() => {
		//
		console.log( 'get Report' );
		const resp = 'Email Template error: not found.';
		sut.getReport();
		tick(1000);
		expect( sut.model.Note ).toEqual( resp );
		sut.windowClose( false );
		//
	} ) );
	//
	// validate, check against a common set of validation rules.
	//
	it('validate should fail and display alert warnings ...', fakeAsync( ( ) => {
		//
		sut.model = emptyData;
		sut.add = true;
		alertService.getAlerts().subscribe( (msg: Alerts) => {
			console.log( msg );
			expect( msg ).toBeTruthy( );
			expect( msg.level ).toBe( AlertLevel.Warning );
		}, error =>	{
			console.error( error );
			expect( 1 ).toEqual( 0 );
		});
		sut.validate();
		sut.windowClose( false );
		//
	} ) );
	//
	// validateNote, check against a common set of validation rules.
	//
	it('validateNote should succeed ...', fakeAsync( ( ) => {
		//
		const data = mockDatum[0];
		const errMsgs: Message[] = sut.validateNote(data, false);
		expect( errMsgs.length ).toEqual( 0 );
		console.log(
			'End of IncidentNoteDetailWindowComponent.\n' +
			'==================================================' );
		//
	} ) );
	//
} );
// ===========================================================================
