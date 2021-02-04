// ===========================================================================
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { ConsoleLogService } from './console-log.service';
import { LogLevel } from './log-level.enum';
//
describe('ConsoleLogService', () => {
	let service: ConsoleLogService;
	//
	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ConsoleLogService);
	});
	//
	it('should be created', () => {
		console.log(
			'===================================\n' +
			'ConsoleLogService should create ...' );
		// given / when
		console.log(`Log level ${environment.logLevel}` );
		// then
		expect(service).toBeTruthy();
	});
	//
	it('should set log-level ...', () => {
		// given
		service.logLevel = LogLevel.Verbose;
		// when
		const _ret = service.logLevel;
		// then
		expect( _ret ).toBe( LogLevel.Verbose );
	});
	//
	it('Error should create Error message ...', () => {
		// given / when
		const _ret = service.Error('Error message');
		// then
		expect( _ret ).toEqual( 'Error: Error message' );
	});
	//
	it('Warning should create Warning message ...', () => {
		// given / when
		const _ret = service.Warning('Warning message');
		// then
		expect( _ret ).toEqual( 'Warning: Warning message' );
	});
	//
	it('Information should create Information message ...', () => {
		// given / when
		const _ret = service.Information('Information message');
		// then
		expect( _ret ).toEqual( 'Info: Information message' );
	});
	//
	it('Debug should create Debug message ...', () => {
		// given / when
		const _ret = service.Debug('Debug message');
		// then
		expect( _ret ).toEqual( 'Debug: Debug message' );
	});
	//
	it('Verbose should create Verbose message ...', () => {
		// given / when
		const _ret = service.Verbose('Verbose message');
		// then
		expect( _ret ).toEqual( 'Verbose: Verbose message' );
	});
	//
	it('Verbose should not print log message ...', () => {
		// given
		service.logLevel = LogLevel.Error;
		// when
		const _ret = service.Verbose('Verbose message');
		// then
		expect( _ret ).toEqual( '' );
	});
	//
	it('LogMessage should log Unknown message ...', () => {
		// test a private method
		// given / when
		const _ret = (service as any).LogMessage( -1, 'Test message' );
		// then
		expect( _ret ).toEqual( 'Unknown: Test message' );
	});
	/*
	** getEnumKeyByEnumValue
	*/
	it('should get LogLevel string value ...', () => {
		const _ret = service.getEnumKeyByEnumValue( LogLevel, LogLevel.Error );
		expect( _ret ).toBe( 'Error' );
	});
	//
	it('should not get LogLevel string value ...', () => {
		const _ret = service.getEnumKeyByEnumValue( LogLevel, 99 );
		expect( _ret ).toEqual( '--' );
	});
	//
});
