// ===========================================================================
// file: LazyLoading.mock
import { LazyLoadEvent } from 'primeng/api';
import { FilterMetadata } from 'primeng/api';
//
import { LazyLoadingMock } from './lazyloading.mock';
//
describe('LazyLoadingMock', () => {
	//
	const lazyLoading: LazyLoadingMock = new LazyLoadingMock();
	//
	const mockDatum: any[] = [
		{ id: 1, name: 'one' },
		{ id: 2, name: 'two' },
		{ id: 3, name: 'three' },
		{ id: 4, name: 'four' },
		{ id: 5, name: 'five' }
	];
	//
	const mockEvent: LazyLoadEvent = {
		first: 0,
		rows: 10,
	};
	/*
	*/
	it('should filter greater than ...', () => {
		const event = { ... mockEvent };
		event.filters = {
			id: { value: 3, matchMode: 'gt' }
		};
		const ret = lazyLoading.LazyLoading( mockDatum, event );
		expect( ret.length ).toEqual( 2 );
	});
	/*
	*/
	it('should filter less than ...', () => {
		const event = { ... mockEvent };
		event.filters = {
			id: { value: 3, matchMode: 'lt' }
		};
		const ret = lazyLoading.LazyLoading( mockDatum, event );
		expect( ret.length ).toEqual( 2 );
	});
	/*
	*/
	it('should filter startswith ...', () => {
		const event = { ... mockEvent };
		event.filters = {
			name: { value: 't', matchMode: 'startswith' }
		};
		const ret = lazyLoading.LazyLoading( mockDatum, event );
		expect( ret.length ).toEqual( 2 );
	});
	/*
	*/
	it('should filter startswith ...', () => {
		const event = { ... mockEvent };
		event.filters = {
			name: { value: 't', matchMode: 'startswith' }
		};
		const ret = lazyLoading.LazyLoading( mockDatum, event );
		expect( ret.length ).toEqual( 2 );
	});
	/*
	*/
	it('should filter skip and take ...', () => {
		const event: LazyLoadEvent = {
			first: 2,
			rows: 2
		};
		const ret = lazyLoading.LazyLoading( mockDatum, event );
		expect( ret.length ).toEqual( 2 );
	});
	/*
	*/
	it('should sort ...', () => {
		const event = { ... mockEvent };
		event.sortField = 'name';
		event.sortOrder = 1;
		const ret = lazyLoading.LazyLoading( mockDatum, event );
		console.warn( ret );
		expect( ret[0].name ).toEqual( 'five' );
		expect( ret[1].name ).toEqual( 'four' );
		expect( ret[2].name ).toEqual( 'one' );
		expect( ret[3].name ).toEqual( 'three' );
		expect( ret[4].name ).toEqual( 'two' );
	});
	//
});
// ===========================================================================
