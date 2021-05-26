// ===========================================================================
import { SelectItem } from 'primeng/api';
//
import { IUser, User } from './user';
import { IIncident, Incident } from './incident';
import { IIncidentNote, IncidentNote } from './incident-note';
import { INetworkLog, NetworkLog } from './network-log';
import { IIncidentType, IncidentType } from './incident-type';
//
export interface INetworkIncident {
	incident: Incident;
	incidentNotes: IncidentNote[];
	deletedNotes: IncidentNote[];
	networkLogs: NetworkLog[];
	deletedLogs: NetworkLog[];
	typeEmailTemplates: IncidentType[];
	NICs: SelectItem[];
	incidentTypes: SelectItem[];
	noteTypes: SelectItem[];
	message: string;
	user: User;
}
//
export class NetworkIncident implements INetworkIncident {
	//
	public incident: Incident = Incident.empty( );
	//
	// public ipAddress: string;
	//
	public incidentNotes: IncidentNote[] = [];
	public deletedNotes: IncidentNote[] = [];
	//
	public networkLogs: NetworkLog[] = [];
	public deletedLogs: NetworkLog[] = [];
	//
	public typeEmailTemplates: IncidentType[] = [];
	//
	public NICs: SelectItem[] = [];
	//
	public incidentTypes: SelectItem[] = [];
	//
	public noteTypes: SelectItem[] = [];
	//
	public message: string = '';
	//
	public user: User = User.empty( );
	//
}
// ===========================================================================
