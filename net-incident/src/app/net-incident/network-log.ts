// ===========================================================================
// File: Network-Log.ts
//  define the interface(INetworkLog/class(NetworkLog)
//
export interface INetworkLog {
	NetworkLogId: number;
	ServerId: number;
	IncidentId: number;
	IPAddress: string;
	NetworkLogDate: Date;
	Log: string;
	IncidentTypeId: number;
	IncidentTypeShortDesc: string;
	Selected: boolean;
	IsChanged: boolean;
	//
	toString(): string;
	//
}
//
export class NetworkLog implements INetworkLog {
	//
	public IsChanged: boolean;
	//
	constructor(
		public NetworkLogId: number,
		public ServerId: number,
		public IncidentId: number,
		public IPAddress: string,
		public NetworkLogDate: Date,
		public Log: string,
		public IncidentTypeId: number,
		public IncidentTypeShortDesc: string,
		public Selected: boolean
	) {
		this.IsChanged = false;
	}
	/*
	** toString implementation for class NetworkLog
	*/
	public toString = (): string => {
		return JSON.stringify( this );
	}
}
// ===========================================================================
