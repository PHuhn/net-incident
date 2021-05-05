// ===========================================================================
// File: base-srvc.service.spec.ts
import { TestBed, waitForAsync } from '@angular/core/testing';
//
import { ConfirmationService } from 'primeng/api';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
//
import { BaseCompService } from './base-comp.service';
//
describe('BaseCompService', () => {
	//
	let sut: BaseCompService;
	//
	beforeEach( waitForAsync( ( ) => {
		TestBed.configureTestingModule( {
			providers: [
				AlertsService,
				ConsoleLogService,
				ConfirmationService
			]
		} );
		// Setup sut
		sut = TestBed.inject( BaseCompService );
		TestBed.compileComponents();
	} ) );
	//
	it('should be created ...', () => {
		expect( sut ).toBeTruthy();
	});
	//
	it('should inject AlertsService ...', () => {
		expect( sut._alerts ).toBeDefined( );
	});
	//
	it('should inject ConsoleLogService ...', () => {
		expect( sut._console ).toBeDefined( );
	});
	//
	it('should inject ConfirmationService ...', () => {
		expect( sut._confirmationService ).toBeDefined( );
	});
	//
});
