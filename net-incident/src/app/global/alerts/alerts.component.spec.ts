/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, inject, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//
import { AlertsComponent } from './alerts.component';
import { AlertsService } from './alerts.service';
import { AlertLevel } from '../alert-level.enum';
import { Message } from '../message';
//
describe('AlertsComponent', () => {
	let sut: AlertsComponent;
	let fixture: ComponentFixture<AlertsComponent>;
	let service: AlertsService;
	//
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ BrowserAnimationsModule ],
			declarations: [ AlertsComponent ],
			providers: [ AlertsService ]
		})
		.compileComponents();
	}));
	//
	beforeEach(inject([AlertsService], (srvc: AlertsService) => {
		service = srvc;
	}));
	//
	beforeEach(() => {
		fixture = TestBed.createComponent(AlertsComponent);
		sut = fixture.componentInstance;
		fixture.detectChanges();
	});
	//
	it('should create', () => {
		console.log(
			'===================================\n' +
			'AlertsComponent should create ...' );
		expect(sut).toBeTruthy();
	});
	//
	it('should take alerts message ...', () => {
		service.setAlerts(AlertLevel.Info, [new Message('1','Hello World')]);
		// console.log( 'AlertsComponent: ' + String( sut.msgs.length ) );
		expect(sut.level).toBe(AlertLevel.Info);
		expect(sut.msgs.length).toBe(1);
		expect(sut.msgs[0].message).toBe('Hello World');
	});
	//
	it('should take WhereWhat Info Message ...', () => {
		service.setWhereWhatInfo('where','what');
		// console.log( 'AlertsComponent: Info: ' + String( sut.msgs.length ) );
		expect(sut.level).toBe(AlertLevel.Info);
		expect(sut.msgs.length).toBe(2);
		expect(sut.msgs[0].message).toBe('where');
		expect(sut.msgs[1].message).toBe('what');
	});
	//
	it('should take WhereWhat Success Message ...', () => {
		service.setWhereWhatSuccess('where','what');
		// console.log( 'AlertsComponent: Success: ' + String( sut.msgs.length ) );
		expect(sut.level).toBe(AlertLevel.Success);
		expect(sut.msgs.length).toBe(2);
		expect(sut.msgs[0].message).toBe('where');
		expect(sut.msgs[1].message).toBe('what');
	});
	//
	it('should take WhereWhat Warning Message ...', () => {
		service.setWhereWhatWarning('where','what');
		// console.log( 'AlertsComponent: Warning: ' + String( sut.msgs.length ) );
		expect(sut.level).toBe(AlertLevel.Warning);
		expect(sut.msgs.length).toBe(2);
		expect(sut.msgs[0].message).toBe('where');
		expect(sut.msgs[1].message).toBe('what');
	});
	//
	it('should take WhereWhatError message ...', () => {
		service.setWhereWhatError('where','what','error');
		// console.log( 'AlertsComponent: error: ' + String( sut.msgs.length ) );
		expect(sut.level).toBe(AlertLevel.Error);
		expect(sut.msgs.length).toBeTruthy(3);
		expect(sut.msgs[0].message).toBe('where');
		expect(sut.msgs[1].message).toBe('what');
		expect(sut.msgs[2].message).toBe('error');
	});
	//
	it('should close on-click of alert message ...', () => {
		service.setAlerts(AlertLevel.Info, [new Message('1','Hello World')]);
		expect(sut.level).toBe(AlertLevel.Info);
		expect(sut.msgs.length).toBe(1);
		expect(sut.msgs[0].message).toBe('Hello World');
		const ret = sut.onClick();
		expect( ret ).toBe( false );
		expect( sut.showMsgs ).toBe( false );
		expect( sut.msgs.length ).toBe( 0 );
	});
	//
	it('warning message should return class ...', () => {
		service.setAlerts(AlertLevel.Warning, [new Message('1','Hello World')]);
		expect(sut.level).toBe(AlertLevel.Warning);
		const css = sut.getClass( );
		expect( css ).toEqual( 'alertMessages nsg-msg-warning' );
	});
	//
	it('error message should return class ...', () => {
		service.setAlerts(AlertLevel.Error, [new Message('1','Hello World')]);
		expect(sut.level).toBe(AlertLevel.Error);
		const css = sut.getClass( );
		expect( css ).toEqual( 'alertMessages nsg-msg-danger' );
	});
	//
	it('info message should return class ...', () => {
		service.setAlerts(AlertLevel.Info, [new Message('1','Hello World')]);
		expect(sut.level).toBe(AlertLevel.Info);
		const css = sut.getClass( );
		expect( css ).toEqual( 'alertMessages nsg-msg-info' );
	});
	//
});
