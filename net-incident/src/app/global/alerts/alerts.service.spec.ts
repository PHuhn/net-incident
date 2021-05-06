// ===========================================================================
// file: alerts.service.spects
import { TestBed, inject, waitForAsync } from '@angular/core/testing';
//
import { AlertsService } from './alerts.service';
import { AlertLevel } from './alert-level.enum';
import { Message } from './message';
import { Alerts } from './alerts';
//
describe('AlertsService', () => {
	let service: AlertsService;
	//
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [AlertsService]
		});
	});
	//
	beforeEach(inject([AlertsService], (srvc: AlertsService) => {
		service = srvc;
	}));
	//
	it('should create ...', () => {
		console.log(
			'===================================\n' +
			'AlertsService should create ...' );
		expect(service).toBeTruthy();
	});
	//
	it('should take alerts message ...', () => {
		const msg = 'Hello World';
		const subscription = service.getAlerts().subscribe(
					(alertMsg: Alerts) => {
			expect(alertMsg.level).toBe(AlertLevel.Info);
			expect(alertMsg.messages.length).toBe(1);
			expect(alertMsg.messages[0].message).toBe(msg);
		}, error =>	console.log( error ) );
		service.setAlerts(AlertLevel.Info, [new Message('1',msg)]);
	});
	//
	it('should take WhereWhat info Message ...', () => {
		const subscription = service.getAlerts().subscribe(
					(alertMsg: Alerts) => {
			expect(alertMsg.level).toBe(AlertLevel.Info);
			expect(alertMsg.messages.length).toBe(2);
			expect(alertMsg.messages[0].message).toBe('where');
			expect(alertMsg.messages[1].message).toBe('what');
		}, error =>	console.log( error ) );
		service.setWhereWhatInfo('where','what');
	});
	//
	it('should take WhereWhat Success Message ...', () => {
		const subscription = service.getAlerts().subscribe(
					(alertMsg: Alerts) => {
			expect(alertMsg.level).toBe(AlertLevel.Success);
			expect(alertMsg.messages.length).toBe(2);
			expect(alertMsg.messages[0].message).toBe('where');
			expect(alertMsg.messages[1].message).toBe('what');
		}, error =>	console.log( error ) );
		service.setWhereWhatSuccess('where','what');
	});
	//
	it('should take WhereWhatWarning message ...', () => {
		const subscription = service.getAlerts().subscribe(
					(alertMsg: Alerts) => {
			expect(alertMsg.level).toBe(AlertLevel.Warning);
			expect(alertMsg.messages.length).toBe(2);
			expect(alertMsg.messages[0].message).toBe('where');
			expect(alertMsg.messages[1].message).toBe('what');
		}, error =>	console.log( error ) );
		service.setWhereWhatWarning('where','what');
	});
	//
	it('should take WhereWhatError message ...', () => {
		const subscription = service.getAlerts().subscribe(
					(alertMsg: Alerts) => {
			expect(alertMsg.level).toBe(AlertLevel.Error);
			expect(alertMsg.messages.length).toBeTruthy(3);
			expect(alertMsg.messages[0].message).toBe('where');
			expect(alertMsg.messages[1].message).toBe('what');
			expect(alertMsg.messages[2].message).toBe('error');
		}, error =>	console.log( error ) );
		service.setWhereWhatError('where','what','error');
	});
	//
	it('should take WhereWhatError empty Message ...', () => {
		const subscription = service.getAlerts().subscribe(
					(alertMsg: Alerts) => {
			expect(alertMsg.level).toBe(AlertLevel.Error);
			expect(alertMsg.messages.length).toBe(3);
			expect(alertMsg.messages[0].message).toBe('-');
			expect(alertMsg.messages[1].message).toBe('-');
			expect(alertMsg.messages[2].message).toBe('-');
		}, error =>	console.log( error ) );
		service.setWhereWhatError('', '', '');
	});
	//
	it('should take warningSet message ...', () => {
		const msg: string = 'Is required.';
		const msgs: Message[] = [new Message( '1', msg )];
		const subscription = service.getAlerts().subscribe(
					(alertMsg: Alerts) => {
			expect(alertMsg.level).toBe(AlertLevel.Warning);
			expect(alertMsg.messages.length).toBeTruthy(1);
			expect(alertMsg.messages[0].message).toBe( msg );
		}, error =>	console.log( error ) );
		const ret = service.warningSet( msgs );
		expect( ret ).toEqual( true );
	});
	it('warningSet should fail if empty message array ...', () => {
		const ret = service.warningSet( [] );
		expect( ret ).toEqual( false );
	});
	//
	it('should take warningInit/Add/Post ...', () => {
		const msg: string = 'Is required.';
		service.warningInit( );
		const retAdd = service.warningAdd( msg );
		const subscription = service.getAlerts().subscribe(
			(alertMsg: Alerts) => {
			expect(alertMsg.level).toBe(AlertLevel.Warning);
			expect(alertMsg.messages.length).toBeTruthy(1);
			expect(alertMsg.messages[0].message).toBe( msg );
		}, error =>	console.log( error ) );
		const retPost = service.warningPost( );
		expect( retAdd ).toEqual( true );
		expect( retPost ).toEqual( true );
	});
	it('warningAdd should fail when empty message ...', () => {
		const retAdd = service.warningAdd( '' );
		expect( retAdd ).toEqual( false );
	});
	it('warningPost should fail when un-initialize ...', () => {
		const retPost = service.warningPost( );
		expect( retPost ).toEqual( false );
	});
	it('warningCount should return 0 after init ...', () => {
		service.warningInit( );
		expect( service.warningCount( ) ).toEqual( 0 );
	});
	//
});
// ===========================================================================
