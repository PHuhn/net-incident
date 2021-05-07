// ===========================================================================
// File: network-incident.service.spec.ts
// Tests of service for: network-incident.service
//
import { TestBed, getTestBed, inject, waitForAsync } from '@angular/core/testing';
//
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
//
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//
import { environment } from '../../../environments/environment';
import { Message } from '../../global/alerts/message';
import { SelectItemClass } from '../../global/select-item-class';
import { IUser, User } from '../user';
import { ServerData } from '../server-data';
import { NetworkIncident } from '../network-incident';
import { NetworkIncidentSave } from '../network-incident-save';
import { IIncident, Incident } from '../incident';
import { INetworkLog, NetworkLog } from '../network-log';
import { NetworkIncidentService } from './network-incident.service';
//
describe('NetworkIncidentService', () => {
	let sut: NetworkIncidentService;
	let http: HttpClient;
	let backend: HttpTestingController;
	const url: string = environment.base_Url + 'NetworkIncident';
	const errMsg: string = 'Fake error';
	//
	const testDate: Date = new Date('2000-01-01T00:00:00-05:00');
	const ip: string = '192.199.1.1';
	const startDate: Date = new Date('2018-03-11T02:00:00-05:00');
	const endDate: Date = new Date('2018-11-04T02:00:00-05:00');
	const server = new ServerData(
		1, 1, 'NSG', 'Srv 1', 'Members Web-site',
		'Web-site', 'Web-site address: www.nsg.com',
		'We are in Michigan, USA.', 'Phil Huhn', 'Phil', 'PhilHuhn@yahoo.com',
		'EST (UTC-5)', true,  'EDT (UTC-4)', startDate, endDate
	);
	//
	const user: User = new User('e0-01','U1','U','N','U N','U','UN1@yahoo.com',true,'734-555-1212', true,1,
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
	const incidentTypes = [
		new SelectItemClass( 1018, 'Unk' ),
		new SelectItemClass( 1019, 'Multiple' ),
		new SelectItemClass( 1020, 'SQL' ),
		new SelectItemClass( 1021, 'PHP' ),
		new SelectItemClass( 1022, 'XSS' ),
		new SelectItemClass( 1023, 'VS' ),
		new SelectItemClass( 1024, 'DIR' ),
		new SelectItemClass( 1026, 'DoS' )
	];
	//
	beforeEach( waitForAsync( ( ) => {
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
	it( 'should create ...', waitForAsync( ( ) => {
		console.log(
			'===================================\n' +
			'NetworkIncidentService should create ...' );
		expect( sut ).toBeTruthy();
	} ) );
	//
	// getNetworkIncident( incidentId: number, serverId: number ): Observable<NetworkIncident>
	//
	it( 'should get by id (primary key) ...', waitForAsync( ( ) => {
		//
		const mockData: NetworkIncident = newNetworkIncident( mockIncident );
		const id1: number = mockIncident.IncidentId;
		const srvId: number = server.ServerId;
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
	/*
	** createIncident( Incident: NetworkIncident )
	*/
	it( 'should create a new NetworkIncident ...', waitForAsync( ( ) => {
		//
		const mockData: NetworkIncidentSave = new NetworkIncidentSave( );
		mockData.incident = new Incident( 0,1,ip,'arin.net','i-4-net','a@1.com','',false,false,false,'i 4',testDate );
		const id1: number = mockData.incident.IncidentId;
		sut.createIncident( mockData ).subscribe(( resp: NetworkIncident ) => {
			expect( resp.incident.IncidentId ).toEqual( id1 );
		});
		const request: TestRequest = backend.expectOne( `${url}` );
		expect( request.request.method ).toBe( 'POST' );
		request.flush( mockData );
		//
	} ) );
	/*
	** updateIncident( networkIncidentSave: NetworkIncidentSave )
	*/
	it( 'updateIncident: should update Incident row...', waitForAsync( ( ) => {
		// given
		const mockData: NetworkIncidentSave = newNetworkIncident(
			new Incident( 21,1,ip,'arin.net','i-4-net','a@1.com','',false,false,false,'i 4',testDate )
		);
		const id1: number = mockData.incident.IncidentId;
		// when
		sut.updateIncident( mockData ).subscribe(( resp: any ) => {
			// then
			expect( resp.incident.IncidentId ).toEqual( id1 );
		});
		// then
		const request: TestRequest = backend.expectOne( `${url}/${id1}` );
		expect( request.request.method ).toBe( 'PUT' );
		request.flush( mockData );
		//
	} ) );
	/*
	** handleError( error: any )
	*/
	it( 'should throw an error...', waitForAsync(() => {
		//
		sut.handleError( errMsg ).subscribe( () => {
			fail( 'handleError: expected error...' );
		}, ( error ) => {
			expect( error ).toEqual( errMsg );
		} );
		//
	}));
	//
	it( 'should throw an empty string error...', waitForAsync(() => {
		//
		sut.handleError( '' ).subscribe( () => {
			fail( 'handleError: expected error...' );
		}, ( error ) => {
			expect( error ).toEqual( 'Service error' );
		} );
		//
	}));
	//
	it( 'should throw a HttpErrorResponse error...', waitForAsync( ( ) => {
		// given
		const resp: HttpErrorResponse = new HttpErrorResponse({
			error: {}, status: 599, statusText: errMsg
		});
		// when
		sut.handleError( resp ).subscribe( () => {
			console.log( JSON.stringify( resp ) );
			fail( 'handleError: expected error...' );
		}, ( error ) => {
			// then
			expect( error ).toEqual( errMsg );
		} );
		//
	} ) );
	/*
	** validateIncident( model: IIncident, add: boolean ): Message[]
	*/
	it( 'validateIncident: should validate...', () => {
		// given
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then
		expect( ret.length ).toEqual( 0 );
		//
	});
	//
	it( 'validateIncident: should handle a validation Incident Id required error...', ( ) => {
		// given
		const incidentidBad: any = undefined;
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.IncidentId = incidentidBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation Server Id required error...', ( ) => {
		// given
		const serveridBad: any = undefined;
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.ServerId = serveridBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation Server Id too large error...', ( ) => {
		// given
		const serveridBad: number = 2147483648;
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.ServerId = serveridBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (is too large, over: #)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'too large' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation I P Address required error...', ( ) => {
		// given
		const ipaddressBad: string = '';
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.IPAddress = ipaddressBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation I P Address max length error...', ( ) => {
		// given
		const ipaddressBad: string = 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii';
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.IPAddress = ipaddressBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (max length of #.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'max length' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation NIC required error...', ( ) => {
		// given
		const nicBad: string = '';
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.NIC = nicBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation NIC max length error...', ( ) => {
		// given
		const nicBad: string = 'iiiiiiiiiiiiiiiiiiii';
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.NIC = nicBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (max length of #.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'max length' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation Network Name max length error...', ( ) => {
		// given
		const networknameBad: string = 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii';
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.NetworkName = networknameBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (max length of #.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'max length' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation Abuse Email Address max length error...', ( ) => {
		// given
		const abuseemailaddressBad: string = 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii';
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.AbuseEmailAddress = abuseemailaddressBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (max length of #.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'max length' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation I S P Ticket Number max length error...', ( ) => {
		// given
		const ispticketnumberBad: string = 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii';
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.ISPTicketNumber = ispticketnumberBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (max length of #.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'max length' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation Mailed required error...', ( ) => {
		// given
		const mailedBad: any = undefined;
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.Mailed = mailedBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation Closed required error...', ( ) => {
		// given
		const closedBad: any = undefined;
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.Closed = closedBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateIncident: should handle a validation Special required error...', ( ) => {
		// given
		const specialBad: any = undefined;
		const model: IIncident = new Incident(
			5, 5, 'i 5', 'i 5', 'i 5', 'i 5', 'i 5', true, true, true, 'i 5', new Date( '2000-01-01T00:00:00' ) );
		model.Special = specialBad;
		// when
		const ret: Message[] = sut.validateIncident( model, true );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	/*
	** validateNetworkLog( model: INetworkLog, add: boolean, incidentTypes: SelectItemClass[] ): Message[]
	*/
	it( 'validateNetworkLog: should validate...', () => {
		// given
		const model: INetworkLog = new NetworkLog(
			5, 1, 5, '172.168', new Date( '2020-07-01T11:11:00' ), 'Log 5', 1021, 'PHP', false );
		// when
		const ret: Message[] = sut.validateNetworkLog( model, true, incidentTypes );
		// then
		expect( ret.length ).toEqual( 0 );
		//
	});
	//
	it( 'validateNetworkLog: should handle a validation Network Log Id required error...', ( ) => {
		// given
		const networklogidBad: any = undefined;
		const model: INetworkLog = new NetworkLog(
			5, 1, 5, '172.168', new Date( '2020-07-01T11:11:00' ), 'Log 5', 1021, 'PHP', false );
		model.NetworkLogId = networklogidBad;
		// when
		const ret: Message[] = sut.validateNetworkLog( model, true, incidentTypes );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateNetworkLog: should handle a validation Server Id required error...', ( ) => {
		// given
		const serveridBad: any = undefined;
		const model: INetworkLog = new NetworkLog(
			5, 1, 5, '172.168', new Date( '2020-07-01T11:11:00' ), 'Log 5', 1021, 'PHP', false );
		model.ServerId = serveridBad;
		// when
		const ret: Message[] = sut.validateNetworkLog( model, true, incidentTypes );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateNetworkLog: should handle a validation Server Id too large error...', ( ) => {
		// given
		const serveridBad: number = 2147483648;
		const model: INetworkLog = new NetworkLog(
			5, 1, 5, '172.168', new Date( '2020-07-01T11:11:00' ), 'Log 5', 1021, 'PHP', false );
		model.ServerId = serveridBad;
		// when
		const ret: Message[] = sut.validateNetworkLog( model, true, incidentTypes );
		// then (is too large, over: #)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'too large' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateNetworkLog: should handle a validation I P Address required error...', ( ) => {
		// given
		const ipaddressBad: string = '';
		const model: INetworkLog = new NetworkLog(
			5, 1, 5, '172.168', new Date( '2020-07-01T11:11:00' ), 'Log 5', 1021, 'PHP', false );
		model.IPAddress = ipaddressBad;
		// when
		const ret: Message[] = sut.validateNetworkLog( model, true, incidentTypes );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateNetworkLog: should handle a validation I P Address max length error...', ( ) => {
		// given
		const ipaddressBad: string = 'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn';
		const model: INetworkLog = new NetworkLog(
			5, 1, 5, '172.168', new Date( '2020-07-01T11:11:00' ), 'Log 5', 1021, 'PHP', false );
		model.IPAddress = ipaddressBad;
		// when
		const ret: Message[] = sut.validateNetworkLog( model, true, incidentTypes );
		// then (max length of #.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'max length' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateNetworkLog: should handle a validation Network Log Date required error...', ( ) => {
		// given
		const networklogdateBad: any = undefined;
		const model: INetworkLog = new NetworkLog(
			5, 1, 5, '172.168', new Date( '2020-07-01T11:11:00' ), 'Log 5', 1021, 'PHP', false );
		model.NetworkLogDate = networklogdateBad;
		// when
		const ret: Message[] = sut.validateNetworkLog( model, true, incidentTypes );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateNetworkLog: should handle a validation Log required error...', ( ) => {
		// given
		const logBad: string = '';
		const model: INetworkLog = new NetworkLog(
			5, 1, 5, '172.168', new Date( '2020-07-01T11:11:00' ), 'Log 5', 1021, 'PHP', false );
		model.Log = logBad;
		// when
		const ret: Message[] = sut.validateNetworkLog( model, true, incidentTypes );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateNetworkLog: should handle a validation Incident Type Id required error...', ( ) => {
		// given
		const incidenttypeidBad: any = undefined;
		const model: INetworkLog = new NetworkLog(
			5, 1, 5, '172.168', new Date( '2020-07-01T11:11:00' ), 'Log 5', 1021, 'PHP', false );
		model.IncidentTypeId = incidenttypeidBad;
		// when
		const ret: Message[] = sut.validateNetworkLog( model, true, incidentTypes );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'required' ) !== -1 ).toBe( true );
	} );
	//
	it( 'validateNetworkLog: should handle a validation Incident Type Id not found error...', ( ) => {
		// given
		const incidenttypeidBad: any = 0;
		const model: INetworkLog = new NetworkLog(
			5, 1, 5, '172.168', new Date( '2020-07-01T11:11:00' ), 'Log 5', 1021, 'PHP', false );
		model.IncidentTypeId = incidenttypeidBad;
		// when
		const ret: Message[] = sut.validateNetworkLog( model, true, incidentTypes );
		// then (is required.)
		expect( ret.length ).toEqual( 1 );
		expect( ret[0].message.indexOf( 'not found' ) !== -1 ).toBe( true );
	} );
	//
});
// ===========================================================================
