//
// ===========================================================================
// Brief Description: Angular 5 for Incident
// Author: Phil Huhn
// Created Date: 11-20-2017
// ---------------------------------------------------------------------------
// Modification
// By		Date	Purpose of Modification
//
// ---------------------------------------------------------------------------
//
//
// File: Incident.ts
//
//  define the interface(IIncident/class(Incident)
export interface IIncident {
	IncidentId: number;
	ServerId: number;
	IPAddress: string;
	NIC: string;
	NetworkName: string;
	AbuseEmailAddress: string;
	ISPTicketNumber: string;
	Mailed: boolean;
	Closed: boolean;
	Special: boolean;
	Notes: string;
	CreatedDate: Date;
	IsChanged: Boolean;
	//
	toString(): string;
	//
}
//
export class Incident implements IIncident {
	//
	public IsChanged: Boolean;
	//
	public static empty( ): IIncident {
		return new Incident(
			0,0,'','','','','',false,false,false,'',new Date('2000-01-01T00:00:00')
		);
	}
	// using short-hand declaration...
	constructor(
		public IncidentId: number,
		public ServerId: number,
		public IPAddress: string,
		public NIC: string,
		public NetworkName: string,
		public AbuseEmailAddress: string,
		public ISPTicketNumber: string,
		public Mailed: boolean,
		public Closed: boolean,
		public Special: boolean,
		public Notes: string,
		public CreatedDate: Date,
	) {
		this.IsChanged = false;
	}
	/*
	** toString implementation for class Incident
	*/
	public toString = (): string => {
		return JSON.stringify( this );
	}
	//
}
