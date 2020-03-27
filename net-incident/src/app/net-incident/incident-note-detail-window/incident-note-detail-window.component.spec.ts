// ===========================================================================
import { async, ComponentFixture, TestBed, getTestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
//
import { HttpClientModule, HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
//
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { Header, Footer } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { ServicesService } from '../services/services.service';
import { ServicesServiceMock } from '../services/mocks/ServicesService.mock';
import { ConfirmationServiceMock } from '../services/mocks/ConfirmationService.mock';
import { SelectItemClass } from '../../global/select-item-class';
import { IIncident, Incident } from '../incident';
import { NetworkIncident } from '../network-incident';
import { IIncidentNote, IncidentNote } from '../incident-note';
import { IncidentNoteDetailWindowComponent } from './incident-note-detail-window.component';
//
describe( 'IncidentNoteDetailWindowComponent', ( ) => {
	let sut: IncidentNoteDetailWindowComponent;
	let fixture: ComponentFixture<IncidentNoteDetailWindowComponent>;
	let alertService: AlertsService;
	let servicesService: ServicesService;
	let confirmationService = ConfirmationService;
	let http: HttpClient;
	let backend: HttpTestingController;
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
	//
	const netInc = new NetworkIncident();
	//
	beforeEach( async( ( ) => {
		TestBed.configureTestingModule(  {
			imports: [ FormsModule,
				ButtonModule,
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
				{ provide: ServicesService, useClass: ServicesServiceMock },
				{ provide: ConfirmationService, useClass: ConfirmationServiceMock }
			]
		});
		// Setup injected pre service for each test
		alertService = getTestBed().get( AlertsService );
		servicesService = getTestBed().get( ServicesService );
		confirmationService = getTestBed().get( ConfirmationService );
		http = TestBed.get( HttpClient );
		backend = TestBed.get( HttpTestingController );
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
		netInc.incident = inc;
		netInc.deletedLogs = [];
		netInc.deletedNotes = [];
		netInc.incidentNotes = mockDatum;
		netInc.typeEmailTemplates = [];
		netInc.user = undefined;
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
		sut.onClose.subscribe( saved => {
			console.log( 'In onClose callback ...' );
				sut.displayWin = false;
			expect( saved ).toBe( true );
		} );
		sut.model.Note = 'This is an updated note.';
		sut.updateItem( );
		//
	} ) );
	//
	// Call directly createItem
	//
	it('should create class when createItem called ...', fakeAsync(() => {
		//
		sut.onClose.subscribe( saved => {
			console.log( 'In onClose callback ...' );
				sut.displayWin = false;
			expect( saved ).toBe( true );
		} );
		sut.incidentnote = new IncidentNote(
			0,undefined,'','',new Date( Date.now() ), true );
		sut.model.NoteTypeId = 3;
		sut.model.NoteTypeShortDesc = 'ISP Rpt';
		sut.model.Note = 'i 9';
		sut.createItem( );
		//
	} ) );
	//
	// Simulate a button clicked, by calling event method
	//
	it('should update class when save button clicked ...', fakeAsync(() => {
		//
		sut.onClose.subscribe( saved => {
			console.log( 'In onClose callback ...' );
				sut.displayWin = false;
			expect( saved ).toBe( true );
		} );
		sut.windowClose( true );
		//
	} ) );
	//
} );
// ===========================================================================
