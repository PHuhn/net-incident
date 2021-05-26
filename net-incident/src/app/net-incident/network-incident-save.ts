// ===========================================================================
import { IUser, User } from './user';
import { IIncident, Incident } from './incident';
import { IIncidentNote, IncidentNote } from './incident-note';
import { INetworkLog, NetworkLog } from './network-log';
//
export class NetworkIncidentSave {
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
	public user: User = User.empty( );
	//
	public message: string = '';
	//
	/*
	constructor( ) {
		this.incident = <Incident>{};
		this.incidentNotes = [];
		this.deletedNotes = [];
		//
		this.networkLogs = [];
		this.deletedLogs = [];
		//
		this.user = <User>{};
		//
		this.message = '';
	}
	*/
}
// ===========================================================================
