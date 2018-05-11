/* tslint:disable:no-unused-variable */
//
import { TestBed, async, inject } from '@angular/core/testing';
//
import { AlertsService } from './alerts.service';
import { AlertLevel } from '../alert-level.enum';
import { Message } from '../message';
import { Alerts } from '../alerts';
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
	it('should take warningSet message ...', () => {
		const msg: string = 'Is required.';
		const msgs: Message[] = [new Message( '1', msg )];
		const subscription = service.getAlerts().subscribe(
					(alertMsg: Alerts) => {
			expect(alertMsg.level).toBe(AlertLevel.Warning);
			expect(alertMsg.messages.length).toBeTruthy(1);
			expect(alertMsg.messages[0].message).toBe( msg );
		}, error =>	console.log( error ) );
		service.warningSet( msgs );
	});
	//
});
