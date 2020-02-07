// ===========================================================================
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
//
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { Header, Footer, ConfirmationService, SelectItem } from 'primeng/api';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { ConfirmationServiceMock } from '../services/mocks/ConfirmationService.mock';
import { IIncident, Incident } from '../incident';
import { NetworkIncident } from '../network-incident';
import { INetworkLog, NetworkLog } from '../network-log';
import { NetworkLogGridComponent } from './network-log-grid.component';
import { TruncatePipe } from '../../global/truncate.pipe';
import { ServerSelectionWindowComponent } from '../../net-incident/server-selection-window/server-selection-window.component';
//
describe('NetworkLogGridComponent', () => {
	let sut: NetworkLogGridComponent;
	let fixture: ComponentFixture<NetworkLogGridComponent>;
	let alertService: AlertsService;
	let confirmService: ConfirmationServiceMock;
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
	const netInc = new NetworkIncident();
	//
	beforeEach( async( ( ) => {
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
				AlertsService,
				{ provide: ConfirmationService, useClass: ConfirmationServiceMock }
			]
		})
		.compileComponents( );
	}));
	//
	beforeEach( inject( [
			AlertsService, ConfirmationService ],
		( alrtSrv: AlertsService,
				confSrvMock: ConfirmationServiceMock ) => {
			alertService = alrtSrv;
			confirmService = confSrvMock;
		}
	) );
	//
	beforeEach( ( ) => {
		fixture = TestBed.createComponent( NetworkLogGridComponent );
		sut = fixture.componentInstance;
		//
		netInc.incident = inc;
		netInc.deletedLogs = [];
		netInc.deletedNotes = [];
		netInc.incidentNotes = [];
		netInc.networkLogs = JSON.parse( JSON.stringify( mockDatum ) );
		netInc.typeEmailTemplates = [];
		netInc.user = undefined;
		netInc.noteTypes = undefined;
		//
	} );
	//
	// Component instantiates
	//
	it('should be created ...', () => {
		sut.networkIncident = netInc;
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
		console.log( `Test - all columns: ** ${new Date().toISOString()}` );
		sut.networkIncident = netInc;
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
		console.log( `Test - all rows: ** ${new Date().toISOString()}` );
		sut.networkIncident = netInc;
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
		console.log( `Test - selection column: ** ${new Date().toISOString()}` );
		netInc.networkLogs = JSON.parse( JSON.stringify( mockDatum ) );
		netInc.incident.Mailed = true;
		netInc.networkLogs[3].Selected = true;
		netInc.incident.IPAddress = netInc.networkLogs[3].IPAddress;
		sut.networkIncident = netInc;
		sut.ngAfterContentInit( );
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		const loop = [1,2,3,4];
		loop.forEach( i => {
			console.log( `** Disabled: ${sut.disabled}, ${i}, ${new Date().toISOString()}` );
			if ( sut.disabled === undefined ) {
				tick( 10000 );
			}
		});
		fixture.detectChanges( ); // trigger final data binding
		fixture.whenStable( );
		console.log( `Test - Id: Disabled: ${sut.disabled} ** ${new Date().toISOString()}` );
		const numCols: number = 5;
		const netLogBodyCols = fixture.debugElement.queryAll(By.css(
			'#netLogTable > div > div > table > tbody > tr:nth-child(1) > td' ));
		console.log( netLogBodyCols );
		netInc.incident.Mailed = false;
		netInc.networkLogs[3].Selected = false;
		expect( netLogBodyCols.length ).toBe( numCols );
	}));
	//
	it('incident should have only selected rows ...', fakeAsync( () => {
		console.log( `Test - rows: ** ${new Date().toISOString()}` );
		netInc.networkLogs = JSON.parse( JSON.stringify( mockDatum ) );
		netInc.networkLogs[4].Selected = true;
		netInc.networkLogs[5].Selected = true;
		netInc.networkLogs[4].IncidentId = netInc.incident.IncidentId;
		netInc.networkLogs[5].IncidentId = netInc.incident.IncidentId;
		netInc.incident.IPAddress = netInc.networkLogs[4].IPAddress;
		sut.networkIncident = netInc;
		sut.ngAfterContentInit( );
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		tick( 10000 );
		fixture.detectChanges( ); // trigger final data binding
		fixture.whenStable( );
		const numRows: number = 2;
		const netLogBodyRows = fixture.debugElement.queryAll(By.css(
			numRowsSelector ));
		console.log( netLogBodyRows );
		netInc.incident.IPAddress = '';
		expect( netLogBodyRows.length ).toBe( numRows );
	}));
	//
	it('should filter on ip-address when selected ...', fakeAsync( () => {
		console.log( `Test - filter on ip: ** ${new Date().toISOString()}` );
		netInc.networkLogs = JSON.parse( JSON.stringify( mockDatum ) );
		sut.networkIncident = netInc;
		sut.ngAfterContentInit( );
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		tick( 10000 );
		//
		const netLogCheckbox: HTMLInputElement = fixture.debugElement.query(By.css(
			'#netLogTable > div > div > table > tbody > tr:nth-child(6) > td:nth-child(2) > p-tablecheckbox > div > div.ui-helper-hidden-accessible > input[type="checkbox"]' )).nativeElement;
		netLogCheckbox.click();
		tick(5000);
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		const numRows: number = 2;
		const netLogBodyRows = fixture.debugElement.queryAll(By.css(
			numRowsSelector ));
		console.log( netLogBodyRows );
		netInc.incident.IPAddress = '';
		expect( netLogBodyRows.length ).toBe( numRows );
	}));
	//
	it('should have all rows when unselected ...', fakeAsync( () => {
		console.log( `Test - unselect row: ** ${new Date().toISOString()}` );
		netInc.networkLogs = JSON.parse( JSON.stringify( mockDatum ) );
		sut.networkIncident = netInc;
		sut.ngAfterContentInit( );
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		tick( 10000 );
		//
		let netLogCheckbox: HTMLInputElement = fixture.debugElement.query(By.css(
			'#netLogTable > div > div > table > tbody > tr:nth-child(4) > td:nth-child(2) > p-tablecheckbox > div > div.ui-chkbox-box.ui-widget.ui-state-default > span' )).nativeElement;
		netLogCheckbox.click();
		tick(5000);
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		let numRows: number = 1;
		let netLogBodyRows = fixture.debugElement.queryAll(By.css(
			numRowsSelector ));
		console.log( netLogBodyRows );
		expect( netLogBodyRows.length ).toBe( numRows );
		netLogCheckbox = fixture.debugElement.query(By.css(
			'#netLogTable > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > p-tablecheckbox > div > div.ui-chkbox-box.ui-widget.ui-state-default > span' )).nativeElement;
		netLogCheckbox.click( );
		tick(5000);
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		numRows = 6;
		netLogBodyRows = fixture.debugElement.queryAll(By.css(
			numRowsSelector ));
		console.log( netLogBodyRows );
		netInc.incident.IPAddress = '';
		expect( netLogBodyRows.length ).toBe( numRows );
	}));
	//
	it('should delete row from in memory networkLogs and move to deletedLogs ...', fakeAsync( () => {
		console.log( `Test - delete row: ** ${new Date().toISOString()}` );
		netInc.networkLogs = JSON.parse( JSON.stringify( mockDatum ) );
		sut.networkIncident = netInc;
		sut.ngAfterContentInit( );
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		tick( 10000 );
		expect( sut.networkIncident.deletedLogs.length ).toBe( 0 );
		expect( sut.networkIncident.networkLogs.length ).toBe( mockDatum.length );
		//
		const delId = 3;
		sut.deleteItem( delId );
		tick(50);
		fixture.detectChanges( ); // trigger initial data binding
		fixture.whenStable( );
		//
		expect( sut.networkIncident.deletedLogs.length ).toBe( 1 );
		expect( sut.networkIncident.networkLogs.length ).toBe( mockDatum.length - 1 );
		expect( sut.networkIncident.deletedLogs[0].NetworkLogId ).toBe( delId );
	}));
	//
});
// ===========================================================================
