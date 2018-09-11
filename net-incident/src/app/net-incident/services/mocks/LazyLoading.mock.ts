// ===========================================================================
// file: LazyLoading.mock
import { LazyLoadEvent } from 'primeng/api';
import { FilterMetadata } from 'primeng/components/common/filtermetadata';
//
export class LazyLoadingMock {
	//
	public codeName: string = 'LazyLoading=Mock';
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
					const filter: FilterMetadata = event.filters[key];
					switch( filter.matchMode.toLowerCase() ) {
						case 'equals': {
							filtered = filtered.filter( el => el[key] === filter.value );
							break;
						}
						case 'gt': {
							filtered = filtered.filter( el => el[key] > filter.value );
							break;
						}
						case 'lt': {
							filtered = filtered.filter( el => el[key] < filter.value );
							break;
						}
						case 'startswith': {
							const _len = filter.value.length;
							filtered = filtered.filter( el => el[key].substring(0, _len) === filter.value );
							break;
						}
						case 'in': {
							filtered = filtered.filter( el => filter.value.includes( el[key] ) );
							break;
						}
						default: {
							console.log(`matchMode not found: ${filter.matchMode}`);
							break;
						}
					}
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
		if( event.sortField !== undefined && event.sortOrder !== undefined ) {
			const key = event.sortField;
			return data.sort( ( n1: any, n2: any ) => {
				if( n1[key] > n2[key] ) {
					return ( event.sortOrder === 1 ? 1: -1 );
				}
				if( n1[key] < n2[key] ) {
					return ( event.sortOrder === 1 ? -1: 1 );
				}
				return 0;
			});
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
