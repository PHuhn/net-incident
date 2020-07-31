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
		console.log(`Log level ${environment.logLevel}` );
		expect(service).toBeTruthy();
	});
	//
	it('should set log-level ...', () => {
		service.logLevel = LogLevel.Verbose;
		const _ret = service.logLevel;
		expect( _ret ).toBe( LogLevel.Verbose );
	});
	//
	it('should take Error message ...', () => {
		const _ret = service.Error('Error message');
		expect( _ret ).toBe( 1 );
	});
	//
	it('should take Warning message ...', () => {
		const _ret = service.Warning('Warning message');
		expect( _ret ).toBe( 1 );
	});
	//
	it('should take Information message ...', () => {
		const _ret = service.Information('Information message');
		expect( _ret ).toBe( 1 );
	});
	//
	it('should take Debug message ...', () => {
		const _ret = service.Debug('Debug message');
		expect( _ret ).toBe( 1 );
	});
	//
	it('should take Verbose message ...', () => {
		const _ret = service.Verbose('Verbose message');
		expect( _ret ).toBe( 1 );
	});
	//
	it('should not print log message ...', () => {
		service.logLevel = LogLevel.Error;
		const _ret = service.Verbose('Verbose message');
		expect( _ret ).toBe( 0 );
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
		expect( _ret ).toBe( null );
	});
	//
});
