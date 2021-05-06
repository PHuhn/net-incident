// ===========================================================================
// File: base-comp.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
//
import { ConfirmationService, Confirmation } from 'primeng/api';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
import { BaseCompService } from './base-comp.service';
import { BaseComponent } from './base-comp.component';
//
describe('BaseCompComponent', () => {
	let sut: BaseComponent;
	let fixture: ComponentFixture<BaseComponent>;
	let baseService: BaseCompService;
	let alertService: AlertsService;
	let consoleService: ConsoleLogService;
	let confirmService: ConfirmationService;
	//
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [
				BaseComponent
			],
			providers: [
				BaseCompService,
				AlertsService,
				ConsoleLogService,
				ConfirmationService
			]
		} );
		baseService = TestBed.inject( BaseCompService );
		// alertService = TestBed.inject( AlertsService );
		// consoleService = TestBed.inject( ConsoleLogService );
		// confirmService = TestBed.inject( ConfirmationService );
		TestBed.compileComponents( );
	});
	//
	beforeEach(() => {
		fixture = TestBed.createComponent(BaseComponent);
		sut = fixture.componentInstance;
		alertService = sut._baseServices._alerts;
		consoleService = sut._baseServices._console;
		confirmService = sut._baseServices._confirmationService;
		fixture.detectChanges();
	});
	//
	it('should create ...', () => {
		expect( sut ).toBeTruthy();
	});
	/*
	** baseErrorHandler( where: string, what: string, error: string )
	*/
	it( 'baseErrorHandler should call alert service ...', fakeAsync( ( ) => {
		// given
		spyOn( alertService, 'setWhereWhatError' );
		// when
		sut.baseErrorHandler( 'where', 'what', 'error' );
		// then
		expect( alertService.setWhereWhatError ).toHaveBeenCalledWith( 'where', 'what', 'error' );
		//
	} ) );
	//
	it( 'baseErrorHandler should call alert service with undefined ...', fakeAsync( ( ) => {
		// given
		spyOn( alertService, 'setWhereWhatError' );
		// when
		sut.baseErrorHandler( 'where', 'what', undefined );
		// then
		expect( alertService.setWhereWhatError ).toHaveBeenCalledWith( 'where', 'what', 'Server error' );
		//
	} ) );
	//
	it('ConsoleLogService should take _console Error message ...', () => {
		// given/when
		const _ret = sut._baseServices._console.Error('Error message');
		// then
		expect( _ret ).toEqual( 'Error: Error message' );
	});
	//
	it('ConfirmationService should exist ...', () => {
		// given/when/then
		expect( sut._baseServices._confirmationService ).toBeDefined( );
	});
	/*
	** baseDeleteConfirm<T>( id: T, callBack: DeleteCallback<T> ): boolean
	*/
	it('baseDeleteConfirm should callback when accept ...', fakeAsync(() => {
		// given
		spyOn( consoleService, 'Information' );
		spyOn(confirmService, 'confirm').and.callFake(
			(confirmation: Confirmation) => {
				expect( confirmation.message ).toEqual( `Are you sure you want to delete Display (id-value)?` );
				if( confirmation.accept !== undefined ) {
					return confirmation.accept();
				}
			});
		const id: string = 'id-value';
		// when
		const ret: boolean = sut.baseDeleteConfirm<string>( id, (ident: string): boolean => {
			expect( ident ).toEqual( id );
			return true;
		}, 'Display' );
		// then
		expect( ret ).toEqual( false );
		tick( 1 ); // give it very small amount of time
		expect( consoleService.Information )
			.toHaveBeenCalledWith( `base-component.baseDeleteConfirm: User's response: true` );
	}));
	//
	it('baseDeleteConfirm should Cancel when reject ...', fakeAsync(() => {
		// given
		spyOn( consoleService, 'Verbose' );
		spyOn( confirmService, 'confirm' ).and.callFake(
			( confirmation: Confirmation ) => {
				if( confirmation.reject !== undefined ) {
					return confirmation.reject();
				}
				return false;
			});
		const id: string = 'id-value';
		// when
		const ret: boolean = sut.baseDeleteConfirm<string>( id, (ident: string): boolean => {
			consoleService.Warning( ident );
			fail( 'baseDeleteConfirm should Cancel' );
			return true;
		} );
		// then
		expect( ret ).toEqual( false );
		tick( 1 ); // give it very small amount of time
		expect( consoleService.Verbose )
			.toHaveBeenCalledWith( `base-component.baseDeleteConfirm: User's dismissed.` );
	}));
	//
});
// ===========================================================================
