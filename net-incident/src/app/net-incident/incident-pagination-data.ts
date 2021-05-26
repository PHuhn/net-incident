// ===========================================================================
//
import { Incident } from './incident';
import { LazyLoadEvent } from 'primeng/api';
//
export class IncidentPaginationData {
	public incidents: Incident[] = [];
	//
	public loadEvent: LazyLoadEvent = {
		first: 0,
		rows: 5,
	};
	//
	public totalRecords: number = 0;
	//
	public message: string = '';
	//
}
