// ===========================================================================
import { async, ComponentFixture, TestBed, getTestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
//
import { Observable, throwError } from 'rxjs';
//
import { TableModule } from 'primeng/components/table/table';
import { Dialog } from 'primeng/components/dialog/dialog';
import { ConfirmDialog } from 'primeng/components/confirmdialog/confirmdialog';
import { Header, Footer } from 'primeng/components/common/shared';
import { ButtonModule } from 'primeng/components/button/button';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { Dropdown, DropdownModule } from 'primeng/components/dropdown/dropdown';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { TruncatePipe } from '../../global/truncate.pipe';
import { ServicesService } from '../services/services.service';
import { ServicesServiceMock } from '../services/mocks/ServicesService.mock';
import { ConfirmationServiceMock } from '../services/mocks/ConfirmationService.mock';
//
import { IIncident, Incident } from '../incident';
import { NetworkIncident } from '../network-incident';
import { IIncidentNote, IncidentNote } from '../incident-note';
import { IncidentNoteGridComponent } from './incident-note-grid.component';
import { IncidentNoteDetailWindowComponent } from '../incident-note-detail-window/incident-note-detail-window.component';
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
	let confirmationService: ConfirmationServiceMock;
	//
	const expectedWindowTitle: string = 'Incident Note Detail: ';
	const windowTitleSelector: string =
		'app-incidentnote-detail-window > p-dialog > div > div.ui-dialog-titlebar > span > p-header > div';
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
	const netInc = new NetworkIncident();
	//
	beforeEach( async( ( ) => {
		TestBed.configureTestingModule(  {
			imports: [
				FormsModule,
				TableModule,
				ButtonModule,
				DropdownModule,
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
				AlertsService,
				{ provide: ServicesService, useClass: ServicesServiceMock },
				{ provide: ConfirmationService, useClass: ConfirmationServiceMock }
			]
		});
		alertService = getTestBed().get( AlertsService );
		servicesService = getTestBed().get( ServicesService );
		confirmationService = getTestBed().get( ConfirmationService );
		TestBed.compileComponents( );
	}));
	//
	beforeEach( ( ) => {
		fixture = TestBed.createComponent( IncidentNoteGridComponent );
		sut = fixture.componentInstance;
		// clone the array with slice( 0 )
		netInc.incident = inc;
		netInc.deletedLogs = [];
		netInc.deletedNotes = [];
		netInc.incidentNotes = mockDatum;
		netInc.typeEmailTemplates = [];
		netInc.user = undefined;
		sut.networkIncident = netInc;
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
	} );
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
	it('should launch detail window when addItemClicked is called ...', async( () => {
		console.log( 'addItemClicked is called ...' );
		sut.addItemClicked( );
		//
		console.log( `~= addItemClicked: ${new Date().toISOString()}` );
		fixture.detectChanges();
		fixture.whenStable();
		console.log( `~=* addItemClicked: ${new Date().toISOString()}` );
		//
		if( sut.windowDisplay === true ) {
			const title: HTMLDivElement = fixture.debugElement.query(By.css(
				'#NoteDetailWindowHeader' )).nativeElement;
			expect( title.innerText ).toEqual( expectedWindowTitle + '0' );
			sut.windowDisplay = false;
		} else {
			console.log( `****** failed ******** ${new Date().toISOString()}` );
			fail('Detail window took too long.');
		}
	}));
	//
	// editItemClicked( )
	//
	it('should launch detail window when editItemClicked is called ...', async( () => {
		console.log( 'editItemClicked is called ...' );
		const incidentNote: IncidentNote = sut.networkIncident.incidentNotes[ 3 ];
		sut.editItemClicked( incidentNote );
		//
		console.log( `~= editItemClicked: ${new Date().toISOString()}` );
		fixture.detectChanges();
		fixture.whenStable();
		console.log( `~=* editItemClicked: ${new Date().toISOString()}` );
		//
		if( sut.windowDisplay === true ) {
			const title: HTMLDivElement = fixture.debugElement.query(By.css(
				'#NoteDetailWindowHeader' )).nativeElement;
			expect( title.innerText ).toEqual( expectedWindowTitle + incidentNote.IncidentNoteId );
			sut.windowDisplay = false;
			console.log( `editItemClicked ... completed ${new Date().toISOString()}` );
		} else {
			console.log( `****** failed ******** ${new Date().toISOString()}` );
			fail('Detail window took too long.');
		}
	}));
	//
	// deleteItemClicked( item: IncidentNote ) :boolean
	//
	it('should delete row when event called and OK is clicked...', fakeAsync(() => {
		//
		const ret: Boolean =
				sut.deleteItemClicked( sut.networkIncident.incidentNotes[ 2 ] );
		confirmationService.accept();
		expect( ret ).toEqual( false );
		tick( );
		// give it very small amount of time
		expect( sut.networkIncident.incidentNotes.length ).toBe( 5 );
		expect( sut.networkIncident.deletedNotes.length ).toBe( 1 );
		//
	}));
	//
} );
// ===========================================================================
