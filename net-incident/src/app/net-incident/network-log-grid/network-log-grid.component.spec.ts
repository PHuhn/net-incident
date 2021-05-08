// ===========================================================================
import { ComponentFixture, TestBed, inject, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
//
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, Confirmation } from 'primeng/api';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { BaseCompService } from '../../common/base-comp/base-comp.service';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
import { IIncident, Incident } from '../incident';
import { INetworkIncident, NetworkIncident } from '../network-incident';
import { INetworkLog, NetworkLog } from '../network-log';
import { NetworkLogGridComponent } from './network-log-grid.component';
import { TruncatePipe } from '../../global/truncate.pipe';
import { ServerSelectionWindowComponent } from '../../net-incident/server-selection-window/server-selection-window.component';
//
describe('NetworkLogGridComponent', () => {
	let sut: NetworkLogGridComponent;
	let fixture: ComponentFixture<NetworkLogGridComponent>;
	let alertService: AlertsService;
	let baseService: BaseCompService;
	let consoleService: ConsoleLogService;
	let confirmService: ConfirmationService;
	//
	const numRowsSelector = '#netLogTable > div > div > table > tbody > tr';
	const ipAddr: string = '192.169.1.1';
	//
	const inc: Incident = new Incident( 4,1,'','arin.net','PSG169',
		'dandy@psg.com','',false,false,false,'',new Date( '2018-04-01T01:00:00' ) );
	//
	const mockDatum = [
		new NetworkLog( 1,1,null,'192.1',new Date( '2018-02-27T00:00:00' ),'Log 1',1, 'SQL', false ),
		new NetworkLog( 2,1,null,'192.2',new Date( '2018-02-27T00:00:00' ),'Log 2',1, 'SQL', false ),
		new NetworkLog( 3,1,null,'192.3',new Date( '2018-02-27T00:00:00' ),'Log 3',1, 'SQL', false ),
		new NetworkLog( 4,1,null,'192.4',new Date( '2018-02-27T00:00:00' ),'Log 4',1, 'SQL', false ),
		new NetworkLog( 5,1,null,'192.5',new Date( '2018-02-27T00:00:00' ),'Log 5',1, 'SQL', false ),
		new NetworkLog( 6,1,null,'192.5',new Date( '2018-02-27T00:00:00' ),'Log 6',1, 'SQL', false )
	];
	//
	beforeEach( waitForAsync( ( ) => {
		TestBed.configureTestingModule(  {
			imports: [
				FormsModule,
				TableModule,
				ButtonModule,
				BrowserAnimationsModule
			],
			declarations: [
				NetworkLogGridComponent,
				Dialog,
				ConfirmDialog,
				TruncatePipe
			],
			providers: [
				BaseCompService,
				AlertsService,
				ConsoleLogService,
				ConfirmationService,
			]
		});
		// Setup injected pre service for each test
		baseService = TestBed.inject( BaseCompService );
		alertService = baseService._alerts;
		consoleService = baseService._console;
		confirmService = baseService._confirmationService;
		TestBed.compileComponents( );
	}));
	//
	beforeEach( ( ) => {
		//
		fixture = TestBed.createComponent( NetworkLogGridComponent );
		sut = fixture.componentInstance;
		//
	} );
	//
	function createNetworkIncident( ): INetworkIncident {
		const netInc = new NetworkIncident();
		netInc.incident = { ... inc };
		netInc.deletedLogs = [];
		netInc.deletedNotes = [];
		netInc.incidentNotes = [];
		netInc.networkLogs = [ ... mockDatum ];
		netInc.networkLogs.forEach( el => el.Selected = false );
		netInc.typeEmailTemplates = [];
		netInc.user = undefined;
		netInc.noteTypes = undefined;
		return netInc;
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
	it('should be created ...', () => {
		sut.networkIncident = createNetworkIncident( );
		sut.ngAfterContentInit( );
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		//
		console.log(
			'===================================\n' +
			'NetworkLogGridComponent should create ...' );
		expect( sut ).toBeTruthy();
	});
	//
	it('default data should have all columns ...', () => {
		sut.networkIncident = createNetworkIncident( );
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		//
		const numCols: number = 7;
		const netLogBodyCols = fixture.debugElement.queryAll(By.css(
			'#netLogTable > div > div > table > tbody > tr:nth-child(1) > td' ));
		expect( netLogBodyCols.length ).toBe( numCols );
	});
	//
	it('default data should have all rows ...', () => {
		sut.networkIncident = createNetworkIncident( );
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		//
		const numRows: number = mockDatum.length;
		const netLogBodyRows = fixture.debugElement.queryAll(By.css(
			'#netLogTable > div > div > table > tbody > tr' ));
		expect( netLogBodyRows.length ).toBe( numRows );
	});
	//
	it('mailed incident should have no selection column ...', fakeAsync( () => {
		const testNetInc: INetworkIncident= createNetworkIncident( );
		testNetInc.incident.Mailed = true;
		testNetInc.networkLogs[3].Selected = true;
		testNetInc.incident.IPAddress = testNetInc.networkLogs[3].IPAddress;
		sut.networkIncident = testNetInc;
		sut.ngAfterContentInit( );
		tickFakeWait( 1 );
		const loop = [1,2,3,4];
		loop.forEach( i => {
			if ( sut.disabled === undefined ) {
				tick( 10000 );
			}
		});
		tickFakeWait( 1 );
		const numCols: number = 5;
		const netLogBodyCols = fixture.debugElement.queryAll(By.css(
			'#netLogTable > div > div > table > tbody > tr:nth-child(1) > td' ));
		expect( netLogBodyCols.length ).toBe( numCols );
	}));
	//
	it('incident should have only selected rows ...', fakeAsync( () => {
		const testNetInc: INetworkIncident= createNetworkIncident( );
		testNetInc.networkLogs[4].Selected = true;
		testNetInc.networkLogs[5].Selected = true;
		testNetInc.networkLogs[4].IncidentId = testNetInc.incident.IncidentId;
		testNetInc.networkLogs[5].IncidentId = testNetInc.incident.IncidentId;
		testNetInc.incident.IPAddress = testNetInc.networkLogs[4].IPAddress;
		sut.networkIncident = testNetInc;
		sut.ngAfterContentInit( );
		tickFakeWait( 1 );
		tickFakeWait( 2000 );
		fixture.detectChanges( ); // trigger final data binding
		fixture.whenStable( );
		const numRows: number = 2;
		const netLogBodyRows = fixture.debugElement.queryAll(By.css(
			numRowsSelector ));
		expect( netLogBodyRows.length ).toBe( numRows );
	}));
	//
	it('should filter on ip-address when selected ...', fakeAsync( () => {
		sut.networkIncident = createNetworkIncident( );
		sut.ngAfterContentInit( );
		tickFakeWait( 1000 );
		//
		const netLogCheckbox: HTMLInputElement = fixture.debugElement.query(By.css(
			'#netLogTable > div > div > table > tbody > tr:nth-child(6) > td:nth-child(2) > p-tablecheckbox > div > div.p-checkbox-box.p-component' )).nativeElement;
		netLogCheckbox.click();
		tickFakeWait( 5000 );
		const numRows: number = 2;
		const netLogBodyRows = fixture.debugElement.queryAll(By.css(
			numRowsSelector ));
		expect( netLogBodyRows.length ).toBe( numRows );
	}));
	//
	it('should have all rows when unselected ...', fakeAsync( () => {
		sut.networkIncident = createNetworkIncident( );
		sut.ngAfterContentInit( );
		tickFakeWait( 100 );
		tickFakeWait( 100 );
		//
		let netLogCheckbox: HTMLInputElement = fixture.debugElement.query(By.css(
			'#netLogTable > div > div > table > tbody > tr:nth-child(4) > td:nth-child(2) > p-tablecheckbox > div > div.p-checkbox-box.p-component' )).nativeElement;
		netLogCheckbox.click();
		tickFakeWait( 5000 );
		let numRows: number = 1;
		let netLogBodyRows = fixture.debugElement.queryAll(By.css(
			numRowsSelector ));
		expect( netLogBodyRows.length ).toBe( numRows );
		netLogCheckbox = fixture.debugElement.query(By.css(
			'#netLogTable > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > p-tablecheckbox > div > div.p-checkbox-box.p-component' )).nativeElement;
		netLogCheckbox.click( );
		tickFakeWait( 2000 );
		numRows = 6;
		netLogBodyRows = fixture.debugElement.queryAll(By.css(
			numRowsSelector ));
		expect( netLogBodyRows.length ).toBe( numRows );
	}));
	//
	it('should delete row from in memory networkLogs and move to deletedLogs ...', fakeAsync( () => {
		sut.networkIncident = createNetworkIncident( );
		sut.ngAfterContentInit( );
		tickFakeWait( 1 );
		tickFakeWait( 2000 );
		expect( sut.networkIncident.deletedLogs.length ).toBe( 0 );
		expect( sut.networkIncident.networkLogs.length ).toBe( mockDatum.length );
		//
		const delId = 3;
		sut.deleteItem( delId );
		tickFakeWait( 50 );
		//
		expect( sut.networkIncident.deletedLogs.length ).toBe( 1 );
		expect( sut.networkIncident.networkLogs.length ).toBe( mockDatum.length - 1 );
		expect( sut.networkIncident.deletedLogs[0].NetworkLogId ).toBe( delId );
	}));
	//
});
// ===========================================================================
