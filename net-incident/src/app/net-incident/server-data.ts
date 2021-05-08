// ---------------------------------------------------------------------------
// File: Server.ts
// Author: Phil Huhn
//
//  define the interface(IServer/class(Server)
export interface IServerData {
	ServerId: number;
	CompanyId: number;
	CompanyName: string;
	ServerShortName: string;
	ServerName: string;
	ServerDescription: string;
	WebSite: string;
	ServerLocation: string;
	FromName: string;
	FromNicName: string;
	FromEmailAddress: string;
	TimeZone: string;
	DST: boolean;
	TimeZone_DST: string;
	DST_Start: Date;
	DST_End: Date;
	//
	toString(): string;
	//
}
//
export class ServerData implements IServerData {
	//
	// using short-hand declaration...
	constructor(
		public ServerId: number,
		public CompanyId: number,
		public CompanyName: string,
		public ServerShortName: string,
		public ServerName: string,
		public ServerDescription: string,
		public WebSite: string,
		public ServerLocation: string,
		public FromName: string,
		public FromNicName: string,
		public FromEmailAddress: string,
		public TimeZone: string,
		public DST: boolean,
		public TimeZone_DST: string,
		public DST_Start: Date,
		public DST_End: Date
	) { }
	/*
	** toString implementation for class Server
	*/
	public toString = (): string => {
		return JSON.stringify( this );
	}
	//
}
// ===========================================================================
