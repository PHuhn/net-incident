/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, inject, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//
import { AlertsComponent } from './alerts.component';
import { AlertsService } from './alerts.service';
import { AlertLevel } from '../alert-level.enum';
import { Message } from '../message';
import { throwError } from 'rxjs';
//
describe('AlertsComponent', () => {
	//
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
		// given / when
		service.setAlerts(AlertLevel.Info, [new Message('1','Hello World')]);
		// then
		// console.log( 'AlertsComponent: ' + String( sut.msgs.length ) );
		expect(sut.level).toBe(AlertLevel.Info);
		expect(sut.msgs.length).toBe(1);
		expect(sut.msgs[0].message).toBe('Hello World');
	});
	//
	it('should take WhereWhat Info Message ...', () => {
		// given / when
		service.setWhereWhatInfo('where','what');
		// then
		// console.log( 'AlertsComponent: Info: ' + String( sut.msgs.length ) );
		expect(sut.level).toBe(AlertLevel.Info);
		expect(sut.msgs.length).toBe(2);
		expect(sut.msgs[0].message).toBe('where');
		expect(sut.msgs[1].message).toBe('what');
	});
	//
	it('should take WhereWhat Success Message ...', () => {
		// given / when
		service.setWhereWhatSuccess('where','what');
		// then
		// console.log( 'AlertsComponent: Success: ' + String( sut.msgs.length ) );
		expect(sut.level).toBe(AlertLevel.Success);
		expect(sut.msgs.length).toBe(2);
		expect(sut.msgs[0].message).toBe('where');
		expect(sut.msgs[1].message).toBe('what');
	});
	//
	it('should take WhereWhat Warning Message ...', () => {
		// given / when
		service.setWhereWhatWarning('where','what');
		// then
		// console.log( 'AlertsComponent: Warning: ' + String( sut.msgs.length ) );
		expect(sut.level).toBe(AlertLevel.Warning);
		expect(sut.msgs.length).toBe(2);
		expect(sut.msgs[0].message).toBe('where');
		expect(sut.msgs[1].message).toBe('what');
	});
	//
	it('should take WhereWhatError message ...', () => {
		// given / when
		service.setWhereWhatError('where','what','error');
		// then
		// console.log( 'AlertsComponent: error: ' + String( sut.msgs.length ) );
		expect(sut.level).toBe(AlertLevel.Error);
		expect(sut.msgs.length).toBeTruthy(3);
		expect(sut.msgs[0].message).toBe('where');
		expect(sut.msgs[1].message).toBe('what');
		expect(sut.msgs[2].message).toBe('error');
	});
	//
	it('should close on-click of alert message ...', () => {
		// given / when
		service.setAlerts(AlertLevel.Info, [new Message('1','Hello World')]);
		// then
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
		// given / when
		service.setAlerts(AlertLevel.Warning, [new Message('1','Hello World')]);
		// then
		expect(sut.level).toBe(AlertLevel.Warning);
		const css = sut.getClass( );
		expect( css ).toEqual( 'alertMessages nsg-msg-warning' );
	});
	//
	it('error message should return class ...', () => {
		// given / when
		service.setAlerts(AlertLevel.Error, [new Message('1','Hello World')]);
		// then
		expect(sut.level).toBe(AlertLevel.Error);
		const css = sut.getClass( );
		expect( css ).toEqual( 'alertMessages nsg-msg-danger' );
	});
	//
	it('info message should return class ...', () => {
		// given / when
		service.setAlerts(AlertLevel.Info, [new Message('1','Hello World')]);
		// then
		expect(sut.level).toBe(AlertLevel.Info);
		const css = sut.getClass( );
		expect( css ).toEqual( 'alertMessages nsg-msg-info' );
	});
	//
	it('OnInit service subscription should handle an error ...', fakeAsync( () => {
		// given
		const errMsg: string = 'Service error';
		spyOn(service, 'getAlerts').and.returnValue( throwError( errMsg ) );
		// when
		sut.ngOnInit( );
		// then
		tick( 1000 );
		expect(sut.level).toBe(AlertLevel.Error);
		expect(sut.msgs.length).toBeTruthy(1);
		expect(sut.msgs[0].message).toBe( errMsg );
	} ) );
	//
});
