// ===========================================================================
import { ComponentFixture, TestBed, getTestBed, inject, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
//
import { Observable, throwError } from 'rxjs';
//
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FocusTrapModule } from 'primeng/focustrap';
import { ConfirmationService, Confirmation } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { TruncatePipe } from '../../global/truncate.pipe';
import { ServicesService } from '../services/services.service';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
import { BaseCompService } from '../../common/base-comp/base-comp.service';
//
import { IIncident, Incident } from '../incident';
import { INetworkIncident, NetworkIncident } from '../network-incident';
import { IIncidentNote, IncidentNote } from '../incident-note';
import { IncidentNoteGridComponent } from './incident-note-grid.component';
import { IncidentNoteDetailWindowComponent, IIncidentNoteWindowInput } from '../incident-note-detail-window/incident-note-detail-window.component';
//
describe( 'IncidentNoteGridComponent', ( ) => {
	// IncidentNoteGridComponent services:
	// private _alerts: AlertsService,
	// private _confirmationService: ConfirmationService
	// IncidentNoteGridComponent loads: IncidentNoteDetailWindowComponent
	// which uses dropdown, ServicesService, http
	let sut: IncidentNoteGridComponent;
	let fixture: ComponentFixture<IncidentNoteGridComponent>;
	let alertService: AlertsService;
	let servicesService: ServicesService;
	let baseService: BaseCompService;
	let consoleService: ConsoleLogService;
	let confirmService: ConfirmationService;
	let windowNoteInput: IIncidentNoteWindowInput;
	//
	const servicesServiceSpy = jasmine.createSpyObj('ServicesService',
		['getPing', 'getWhoIs', 'getService']);
	const expectedWindowTitle: string = 'Incident Note Detail: ';
	const windowTitleSelector: string =
		'app-incidentnote-detail-window > p-dialog > div > div.p-dialog-titlebar > span > p-header > div';
	const ipAddr: string = '192.169.1.1';
	//
	const mockDatum = [
		new IncidentNote( 1,1,'Ping','i 1',new Date( '2018-01-01T00:00:00' ), false ),
		new IncidentNote( 2,2,'Whois','i 2',new Date( '2018-01-02T00:00:00' ), false ),
		new IncidentNote( 3,3,'ISP Rpt','i 3',new Date( '2018-01-03T00:00:00' ), false ),
		new IncidentNote( 4,1,'Ping','i 4',new Date( '2018-01-04T00:00:00' ), false ),
		new IncidentNote( 5,2,'Whois','i 5',new Date( '2018-01-05T00:00:00' ), false ),
		new IncidentNote( 6,3,'ISP Rpt','i 6',new Date( '2018-01-06T00:00:00' ), false )
	];
	//
	const inc: Incident = new Incident( 4,1,ipAddr,'arin.net','PSG169',
		'dandy@psg.com','',false,false,false,'',new Date( '2018-04-01T01:00:00' ) );
	//
	beforeEach( waitForAsync( ( ) => {
		TestBed.configureTestingModule(  {
			imports: [
				FormsModule,
				TableModule,
				ButtonModule,
				DropdownModule,
				FocusTrapModule,
				BrowserAnimationsModule,
				// HttpClient 4.3 testing
				HttpClientModule,
				HttpClientTestingModule
			],
			declarations: [
				IncidentNoteGridComponent,
				IncidentNoteDetailWindowComponent,
				Dialog,
				ConfirmDialog,
				TruncatePipe
			],
			providers: [
				BaseCompService,
				AlertsService,
				ConfirmationService,
				{ provide: ServicesService, useValue: servicesServiceSpy },
			]
		});
		// Setup injected pre service for each test
		baseService = TestBed.inject( BaseCompService );
		alertService = baseService._alerts;
		consoleService = baseService._console;
		confirmService = baseService._confirmationService;
		servicesService = TestBed.inject( ServicesService );
		TestBed.compileComponents( );
	}));
	//
	beforeEach( ( ) => {
		windowNoteInput = {
			model: { ... mockDatum[2] },
			networkIncident: createNetworkIncident( ),
			displayWin: true
		};
		fixture = TestBed.createComponent( IncidentNoteGridComponent );
		sut = fixture.componentInstance;
		// clone the array with slice( 0 )
		sut.networkIncident = createNetworkIncident( );
		sut.ngAfterViewInit( );
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
	} );
	//
	function createNetworkIncident( ): INetworkIncident {
		const networkIncident: INetworkIncident = new NetworkIncident();
		networkIncident.incident = { ... inc };
		networkIncident.deletedLogs = [];
		networkIncident.deletedNotes = [];
		networkIncident.incidentNotes = [ ... mockDatum ];
		networkIncident.typeEmailTemplates = [];
		networkIncident.user = undefined;
		return networkIncident;
	}
	/*
	** Cleanup so no dialog window will still be open
	*/
	function windowCleanup( ) {
		sut.windowIncidentNoteInput = undefined;
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
	// Component instantiates
	//
	it( 'should be created ...', ( ) => {
		console.log(
			'===================================\n' +
			'IncidentNoteGridComponent should create ...' );
		expect( sut ).toBeTruthy( );
	} );
	//
	// getIncidentNotes( ) : Observable<IIncidentNote[]>
	//
	it('should initialize with all data ...', fakeAsync( () => {
		expect( sut.networkIncident.incidentNotes.length ).toBe( 6 );
		//
		expect( sut.networkIncident.incidentNotes[ 0 ].IncidentNoteId ).toEqual( 1 );
		expect( sut.networkIncident.incidentNotes[ 1 ].IncidentNoteId ).toEqual( 2 );
		expect( sut.networkIncident.incidentNotes[ 2 ].IncidentNoteId ).toEqual( 3 );
		expect( sut.networkIncident.incidentNotes[ 3 ].IncidentNoteId ).toEqual( 4 );
		expect( sut.networkIncident.incidentNotes[ 4 ].IncidentNoteId ).toEqual( 5 );
		expect( sut.networkIncident.incidentNotes[ 5 ].IncidentNoteId ).toEqual( 6 );
	}));
	//
	// addItemClicked( )
	//
	it('should launch detail window when addItemClicked is called ...', fakeAsync( () => {
		sut.addItemClicked( );
		//
		tickFakeWait( 10 );
		//
		const title: HTMLDivElement = fixture.debugElement.query(By.css(
			'#NoteDetailWindowHeader' )).nativeElement;
		expect( title.innerText ).toEqual( expectedWindowTitle + '0' );
		windowCleanup( );
	}));
	//
	// editItemClicked( )
	//
	it('should launch detail window when editItemClicked is called ...', fakeAsync( () => {
		const incidentNote: IncidentNote = sut.networkIncident.incidentNotes[ 3 ];
		sut.editItemClicked( incidentNote );
		//
		tickFakeWait( 10 );
		//
		const title: HTMLDivElement = fixture.debugElement.query(By.css(
			'#NoteDetailWindowHeader' )).nativeElement;
		expect( title.innerText ).toEqual( expectedWindowTitle + incidentNote.IncidentNoteId );
		windowCleanup( );
	}));
	/*
	** deleteItemClicked( item: IncidentNote ) :boolean
	*/
	it('should delete row when event called and OK is clicked...', fakeAsync(() => {
		// given
		spyOn(confirmService, 'confirm').and.callFake(
			(confirmation: Confirmation) => {
				console.log(confirmation.message);
				if( confirmation.accept !== undefined ) {
					return confirmation.accept();
				}
				return true;
			});
		// when
		const ret: Boolean =
				sut.deleteItemClicked( sut.networkIncident.incidentNotes[ 2 ] );
		// then
		expect( ret ).toEqual( false );
		tickFakeWait( 1 );
		// give it very small amount of time
		expect( sut.networkIncident.incidentNotes.length ).toBe( 5 );
		expect( sut.networkIncident.deletedNotes.length ).toBe( 1 );
		//
	}));
	//
	it('should not delete if mailed ...', fakeAsync(() => {
		// given
		sut.networkIncident.incident.Mailed = true;
		sut.ngAfterViewInit( );
		spyOn( alertService, 'setWhereWhatWarning' );
		// when
		const ret: Boolean =
				sut.deleteItemClicked( sut.networkIncident.incidentNotes[ 2 ] );
		// then
		expect( ret ).toEqual( false );
		expect( sut.DisableDelete ).toEqual( true );
		tickFakeWait( 1 );
		expect( alertService.setWhereWhatWarning ).toHaveBeenCalled( );
		//
	}));
	//
	it('should not delete if not found ...', fakeAsync(() => {
		// given
		spyOn( alertService, 'setWhereWhatWarning' );
		// when
		const ret: Boolean = sut.deleteItem( -99 );
		// then
		expect( ret ).toEqual( false );
		expect( alertService.setWhereWhatWarning ).toHaveBeenCalled( );
		//
	}));
	//
	// onClose( saved: boolean ): void
	//
	it('should not delete if mailed ...', fakeAsync(() => {
		// given
		sut.windowIncidentNoteInput = windowNoteInput;
		tickFakeWait( 1 );
		// when
		sut.onClose( true );
		// then
		tickFakeWait( 1 );
		expect( sut.windowIncidentNoteInput ).toBeUndefined( );
		tickFakeWait( 1 );
		//
	}));
	//
} );
// ===========================================================================
