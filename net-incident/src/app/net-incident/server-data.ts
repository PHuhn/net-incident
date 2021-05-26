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
	public static empty( ): IServerData {
		return new ServerData(
			0, 0, '', '', '', '', '', '',
			'', '', '', 'EST (UTC-5)', true, 'EDT (UTC-4)',
			new Date('2018-03-11T02:00:00'), new Date('2018-11-04T02:00:00')
		);
	}
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
