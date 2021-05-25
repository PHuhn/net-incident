// ===========================================================================
// file: LazyLoading.mock
import { LazyLoadEvent } from 'primeng/api';
import { FilterMetadata } from 'primeng/api';
//
export class LazyLoadingMock {
	//
	public codeName: string = 'lazy-loading.mock';
	//
	// apply filters, sort/ordered by, skip/take
	//
	LazyLoading( datasource: any[], event: LazyLoadEvent ): any[] {
		//
		if ( datasource ) {
			// console.log( event );
			let filtered: any[] = datasource.slice( 0 );
			if( event.filters ) {
				filtered = this.LazyFilters( filtered, event );
			}
			// sort
			if( event.sortField !== undefined && event.sortOrder !== undefined ) {
				filtered = this.LazyOrderBy( filtered, event );
			}
			// skip & take
			if( event.first !== undefined && event.rows !== undefined ) {
				filtered = this.LazySkipTake( filtered, event );
			}
			return filtered;
		} else {
			console.error( `${this.codeName}.lazyLoading: no data.` );
		}
		return [];
	}
	//
	// Filters (where)
	//
	LazyFilters( filtered: any[], event: LazyLoadEvent ): any[] {
		if( event.filters ) {
			for (const key in event.filters) {
				if (event.filters.hasOwnProperty( key )) {
					const filterMeta: FilterMetadata = event.filters[key];
					if (Array.isArray(filterMeta)) {
						for (const filter of filterMeta) {
							filtered = this._filter( filtered, key, filter );
						}
					} else {
						filtered = this._filter( filtered, key, filterMeta );
					}
				}
			}
		}
		return filtered;
	}
	_filter( filtered: any[], key: string, filter: FilterMetadata ): any[] {
		const matchMode = filter.matchMode !== undefined ? filter.matchMode : '';
		const value: any = filter.value !== null ? filter.value : '';
		if( matchMode !== '' ) {
			switch( matchMode.toLowerCase() ) {
				case 'equals': {
					filtered = filtered.filter( el => el[key] === value );
					break;
				}
				case 'notequals': {
					filtered = filtered.filter( el => el[key] !== value );
					break;
				}
				case 'gt': {
					filtered = filtered.filter( el => el[key] > value );
					break;
				}
				case 'lt': {
					filtered = filtered.filter( el => el[key] < value );
					break;
				}
				case 'startswith': {
					const _len = value.length;
					filtered = filtered.filter( el => el[key].substring(0, _len) === value );
					break;
				}
				case 'endswith': {
					const _len = value.length;
					filtered = filtered.filter( el => el[key].endsWith( value ) );
					break;
				}
				case 'in': {
					filtered = filtered.filter( el => value.includes( el[key] ) );
					break;
				}
				case 'contains': {
					filtered = filtered.filter( el => el[key].includes( value ) );
					break;
				}
				case 'notcontains': {
					filtered = filtered.filter( el => !el[key].includes( value ) );
					break;
				}
				default: {
					console.log(`matchMode not found: ${filter.matchMode}`);
					break;
				}
			}
		}
		return filtered;
	}
	//
	// Order-by (sort)
	// event.sortField = Field name to sort with
	// event.sortOrder = Sort order as number, 1 for asc and -1 for dec
	//
	LazyOrderBy( data: any[], event: LazyLoadEvent ): any[] {
		if( data.length > 0 ) {
			if( event.sortField !== undefined ) {
				const key = event.sortField;
				if( event.sortOrder !== undefined ) {
					const sortOrder: number = event.sortOrder !== undefined ? event.sortOrder : 1;
					return data.sort( ( n1: any, n2: any ) => {
						if( n1[key] > n2[key] ) {
							return ( sortOrder === 1 ? 1: -1 );
						}
						return ( sortOrder === 1 ? -1: 1 );
					});
				}
			}
		}
		return data;
	}
	//
	// skip-take (page of data)
	//
	LazySkipTake( data: any[], event: LazyLoadEvent ): any[] {
		if( event.first !== undefined && event.rows !== undefined ) {
			return data.slice( event.first, ( event.first + event.rows ) );
		}
		return data;
	}
	//
}
// ===========================================================================
