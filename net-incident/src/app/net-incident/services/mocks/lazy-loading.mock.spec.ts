// ===========================================================================
// file: LazyLoading.mock
import { LazyLoadEvent } from 'primeng/api';
import { FilterMetadata } from 'primeng/api';
//
import { LazyLoadingMock } from './lazy-loading.mock';
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
	** LazyFilters( filtered: any[], event: LazyLoadEvent ): any[]
	*/
	it('LazyFilters: should filter equals ...', () => {
		// given
		const event = { ... mockEvent };
		event.filters = {
			id: { value: 3, matchMode: 'equals' }
		};
		// when
		const ret = lazyLoading.LazyFilters( [ ... mockDatum ], event );
		// then
		expect( ret.length ).toEqual( 1 );
	});
	//
	it('LazyFilters: should filter greater than ...', () => {
		// given
		const event = { ... mockEvent };
		event.filters = {
			id: { value: 3, matchMode: 'gt' }
		};
		// when
		const ret = lazyLoading.LazyFilters( [ ... mockDatum ], event );
		// then
		expect( ret.length ).toEqual( 2 );
	});
	//
	it(`LazyFilters: should filter 'less than' ...`, () => {
		// given
		const event = { ... mockEvent };
		event.filters = {
			id: { value: 3, matchMode: 'lt' }
		};
		// when
		const ret = lazyLoading.LazyFilters( [ ... mockDatum ], event );
		// then
		expect( ret.length ).toEqual( 2 );
	});
	//
	it(`LazyFilters: should filter 'startswith' ...`, () => {
		// given
		const event = { ... mockEvent };
		event.filters = {
			name: { value: 't', matchMode: 'startswith' }
		};
		// when
		const ret = lazyLoading.LazyFilters( [ ... mockDatum ], event );
		// then
		expect( ret.length ).toEqual( 2 );
	});
	//
	it(`LazyFilters: should not filter with bad matchMode ...`, () => {
		// given
		const event = { ... mockEvent };
		event.filters = {
			name: { value: 't', matchMode: 'xxxxx' }
		};
		// when
		const ret = lazyLoading.LazyFilters( [ ... mockDatum ], event );
		// then
		expect( ret.length ).toEqual( 5 );
	});
	/*
	** LazySkipTake( data: any[], event: LazyLoadEvent ): any[]
	*/
	it('LazySkipTake: should filter skip and take (paging) ...', () => {
		// given
		const event: LazyLoadEvent = {
			first: 2,
			rows: 2
		};
		// when
		const ret = lazyLoading.LazySkipTake( [ ... mockDatum ], event );
		// then
		expect( ret.length ).toEqual( 2 );
	});
	//
	it('LazySkipTake: should not page, if incomplete event ...', () => {
		// given
		const event: LazyLoadEvent = { rows: 2 };
		// when
		const ret = lazyLoading.LazySkipTake( [ ... mockDatum ], event );
		// then
		expect( ret.length ).toEqual( 5 );
	});
	/*
	** LazyOrderBy( data: any[], event: LazyLoadEvent ): any[]
	*/
	it('LazyOrderBy: should sort ...', () => {
		// given
		const event = { ... mockEvent };
		event.sortField = 'name';
		event.sortOrder = 1;
		// when
		const ret = lazyLoading.LazyOrderBy( [ ... mockDatum ], event );
		// then
		expect( ret[0].name ).toEqual( 'five' );
		expect( ret[1].name ).toEqual( 'four' );
		expect( ret[2].name ).toEqual( 'one' );
		expect( ret[3].name ).toEqual( 'three' );
		expect( ret[4].name ).toEqual( 'two' );
	});
	//
	it('LazyOrderBy: should not sort, if incomplete event ...', () => {
		// given
		const event = { ... mockEvent };
		event.sortField = 'name';
		// when
		const ret = lazyLoading.LazyOrderBy( [ ... mockDatum ], event );
		// then
		expect( ret[0].name ).toEqual( 'one' );
		expect( ret[1].name ).toEqual( 'two' );
		expect( ret[2].name ).toEqual( 'three' );
		expect( ret[3].name ).toEqual( 'four' );
		expect( ret[4].name ).toEqual( 'five' );
	});
	/*
	** LazyLoading( datasource: any[], event: LazyLoadEvent ): any[]
	*/
	it(`LazyLoading: should filter 'in', sort ordered by ...`, () => {
		// given
		const event = { ... mockEvent };
		event.filters = {
			name: { value: ['two', 'four'], matchMode: 'in' }
		};
		event.sortField = 'name';
		event.sortOrder = -1;
		// when
		const ret = lazyLoading.LazyLoading( [ ... mockDatum ], event );
		// then
		expect( ret.length ).toEqual( 2 );
		expect( ret[0].name ).toEqual( 'two' );
		expect( ret[1].name ).toEqual( 'four' );
	});
	//
	it('LazyLoading: should return unchanged data if no event ...', () => {
		// given / when
		const ret = lazyLoading.LazyLoading( [ ... mockDatum ], {} );
		// then
		expect( ret.length ).toEqual( 5 );
		console.warn( ret );
		expect( ret[0].name ).toEqual( 'one' );
		expect( ret[1].name ).toEqual( 'two' );
		expect( ret[2].name ).toEqual( 'three' );
		expect( ret[3].name ).toEqual( 'four' );
		expect( ret[4].name ).toEqual( 'five' );
	});
	//
	it('LazyLoading: should handled error ...', () => {
		// given
		const event = { ... mockEvent }; // skip/take
		// when
		const ret = lazyLoading.LazyLoading( undefined, event );
		// then
		expect( ret.length ).toEqual( 0 );
	});
	//
});
// ===========================================================================
