// ===========================================================================
import { TruncatePipe } from './truncate.pipe';
//
describe('TruncatePipe', () => {
	//
	let pipe: TruncatePipe;
	let val: string = '12345678901234567890';
	//
	beforeEach(() => {
		pipe = new TruncatePipe();
	});
	//
	it( 'create an instance ...', () => {
		expect(pipe).toBeTruthy();
	});
	//
	it( 'should not change a too short value ...', () => {
		expect( pipe.transform( val, [ '30', '' ] ) ).toBe( val );
	});
	//
	it( 'should not change a too short value with ellipsis ...', () => {
		expect( pipe.transform( val, [ '30', '...' ] ) ).toBe( val );
	});
	//
	it( 'should change a too long value ...', () => {
		expect( pipe.transform( val, [ '15', '' ] ) ).toBe( val.substring(0,15) );
	});
	//
	it( 'should change a too long value with ellipsis ...', () => {
		expect( pipe.transform( val, [ '15', '...' ] ) ).toBe( val.substring(0,15) + '...' );
	});
	//
});
// ===========================================================================
