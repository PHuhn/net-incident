// ===========================================================================
//	File: network-incident.service.spec.ts
//	Tests of service for: network-incident.service
//
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
//
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
//
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//
import { environment } from '../../../environments/environment';
import { Message } from '../../global/message';
import { SelectItemClass } from '../select-item-class';
import { IUser, User } from '../user';
import { ServerData } from '../server-data';
import { NetworkIncident } from '../network-incident'
import { NetworkIncidentSave } from '../network-incident-save'
import { IIncident, Incident } from '../incident';
import { INetworkLog, NetworkLog } from '../network-log';
import { NetworkIncidentService } from './network-incident.service';
//
describe('NetworkIncidentService', () => {
	let sut: NetworkIncidentService;
	let http: HttpClient;
	let backend: HttpTestingController;
	let url: string = environment.base_Url + 'NetworkIncident';
	let errMsg: string = 'Fake error';
	//
	let testDate: Date = new Date('2000-01-01T00:00:00-05:00');
	const ip: string = '192.199.1.1';
	let startDate: Date = new Date('2018-03-11T02:00:00-05:00');
	let endDate: Date = new Date('2018-11-04T02:00:00-05:00');
    let server = new ServerData(
		1, 1, 'NSG', 'Srv 1', 'Members Web-site',
		'Web-site', 'Web-site address: www.nsg.com',
		'We are in Michigan, USA.', 'Phil Huhn', 'Phil', 'PhilHuhn@yahoo.com',
		'EST (UTC-5)', true,  'EDT (UTC-4)', startDate, endDate
	);
	let user: User = new User('e0-01','U1','U','N','U N','U','UN1@yahoo.com',true,'734-555-1212', true,1,
		[new SelectItemClass('srv 1','Server 1'), new SelectItemClass('srv 2','Server 2')],'srv 1', server,['admin']);
	//
	const mockIncident: Incident = 
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
		TestBed.configureTestingModule( {
			imports: [
				// HttpClient 4.3 testing
				HttpClientModule,
				HttpClientTestingModule
			],
			providers: [
				NetworkIncidentService
			]
		} );
		// Setup injected pre service for each test
		http = TestBed.get( HttpClient );
		backend = TestBed.get( HttpTestingController );
		//
		sut = getTestBed().get( NetworkIncidentService );
		TestBed.compileComponents();
	} ) );
	//
	afterEach( ( ) => {
		// cleanup
		backend.verify();
	} );
	//
	function newNetworkIncident( incident: Incident ): NetworkIncident {
		let _ni = new NetworkIncident( );
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
	it( 'should create ...', async( ( ) => {
		console.log(
			'===================================\n' +
			'NetworkIncidentService should create ...' );
		expect( sut ).toBeTruthy();
	} ) );
	//
	// getNetworkIncident( incidentId: number, serverId: number ): Observable<NetworkIncident>
	//
	it( 'should get by id (primary key) ...', async( ( ) => {
		//
		let mockData: NetworkIncident = newNetworkIncident( mockIncident );
		let id1: number = mockIncident.IncidentId;
		let srvId: number = server.ServerId;
		sut.getNetworkIncident( id1, srvId ).subscribe( ( data: NetworkIncident ) => {
			// console.log( data );
			expect( data.incident.IncidentId ).toEqual( id1 );
		});
		// use the HttpTestingController to mock requests and the flush method to provide dummy values as responses
		// use expectOne(), expectNone() and match()
		const urlPath: string = url + '?id=' + String( id1 ) + '&serverId=' + String(srvId);
		const request = backend.expectOne( `${urlPath}` );
		expect( request.request.method ).toBe( 'GET' );
		request.flush( mockData );
		//
	} ) );
	//
	// createIncident( Incident: NetworkIncident )
	//
	it( 'should create a new NetworkIncident ...', async( ( ) => {
		//
		let mockData: NetworkIncident = newNetworkIncident( 
			new Incident( 0,1,ip,'arin.net','i-4-net','a@1.com','',false,false,false,'i 4',testDate )
		);
		let id1: number = mockData.incident.IncidentId;
		sut.createIncident( mockData ).subscribe(( resp: NetworkIncident ) => {
			expect( resp.incident.IncidentId ).toEqual( id1 );
		});
		const request: TestRequest = backend.expectOne( `${url}` );
		expect( request.request.method ).toBe( 'POST' );
		request.flush( mockData );
		//
	} ) );
	//
});
// ===========================================================================
