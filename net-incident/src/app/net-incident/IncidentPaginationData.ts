// ===========================================================================
//
import { Incident } from './incident';
import { LazyLoadEvent } from 'primeng/api';
//
export class IncidentPaginationData {
    public incidents: Incident[];
    //
    public loadEvent: LazyLoadEvent;
    //
    public totalRecords: number;
    //
    public message: string;
    //
}
