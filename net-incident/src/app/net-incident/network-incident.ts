// ===========================================================================
import { SelectItem } from 'primeng/api';
//
import { IUser, User } from './user';
import { IIncident, Incident } from './incident';
import { IIncidentNote, IncidentNote } from './incident-note';
import { INetworkLog, NetworkLog } from './network-log';
import { IIncidentType, IncidentType } from './incident-type';
//
export class NetworkIncident {
	//
	public incident: Incident;
	//
	// public ipAddress: string;
	//
	public incidentNotes: IncidentNote[];
	public deletedNotes: IncidentNote[];
	//
	public networkLogs: NetworkLog[];
	public deletedLogs: NetworkLog[];
	//
	public typeEmailTemplates: IncidentType[];
	//
	public NICs: SelectItem[];
	//
	public incidentTypes: SelectItem[];
	//
	public noteTypes: SelectItem[];
	//
	public message: string;
	//
	public user: User;
	//
}
// ===========================================================================
