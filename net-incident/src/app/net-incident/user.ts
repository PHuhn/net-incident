// ===========================================================================
// File: User.ts
// Brief Description: Angular 5 for AspNetUsers
// Author: Phil Huhn
//
// public string Id { get; set; }
// public string UserName { get; set; }
// public string FirstName { get; set; }
// public string LastName { get; set; }
// public string FullName { get; set; }
// public string UserNicName { get; set; }
// public string Email { get; set; }
// public bool EmailConfirmed { get; set; }
// public string PhoneNumber { get; set; }
// public bool PhoneNumberConfirmed { get; set; }
// public int CompanyId { get; set; }
// public string ServerShortName { get; set; }
// public string[] ServerShortNames { get; set; }
// public ServerData Server { get; set; }
//  define the interface(IAspNetUser/class(AspNetUser)
//
import { ServerData } from './server-data';
import { SelectItem } from 'primeng/components/common/selectitem';
//
export interface IUser {
	Id: string;
	UserName: string;
	FirstName: string;
	LastName: string;
	FullName: string;
	UserNicName: string;
	Email: string;
	EmailConfirmed: boolean;
	PhoneNumber: string;
	PhoneNumberConfirmed: boolean;
	CompanyId: number;
	ServerShortNames: SelectItem[];
	ServerShortName: string;
	Server: ServerData;
	Roles: string[];
}
//
export class User implements IUser {
	//
	// using short-hand declaration...
	constructor(
		public Id: string,
		public UserName: string,
		public FirstName: string,
		public LastName: string,
		public FullName: string,
		public UserNicName: string,
		public Email: string,
		public EmailConfirmed: boolean,
		public PhoneNumber: string,
		public PhoneNumberConfirmed: boolean,
		public CompanyId: number,
		public ServerShortNames: SelectItem[],
		public ServerShortName: string,
		public Server: ServerData,
		public Roles: string[]
	) { }
	//
}
// ===========================================================================
