// ===========================================================================
// File: security.ts
import { IUser, User } from './user';
//
export class Security {
	//
	private codeName: string;
	//
	constructor( private user: User ) {
		this.codeName = 'Security';
	}
	//
	getUser( ): User {
		return this.user;
	}
	//
	isValidIncidentGrid( ): boolean {
		if( this.user === undefined ) {
			return false;
		}
		if( this.user.Roles.length === 0 ) {
			return false;
		}
		for( let role of this.user.Roles) {
			role = role.toLowerCase( );
			if( ['admin','user','companyadmin','public'].indexOf( role ) !== -1 ) {
				// console.log( `${this.codeName}.isValidIncidentGrid, role: ${role} returning true` );
				return true;
			}
		}
		return false;
	}
	//
	isValidIncidentDetail( ): boolean {
		if( this.user === undefined ) {
			return false;
		}
		if( this.user.Roles.length === 0 ) {
			return false;
		}
		for( let role of this.user.Roles) {
			role = role.toLowerCase( );
			if( ['admin','user','companyadmin'].indexOf( role ) !== -1 ) {
				// console.log( `${this.codeName}.isValidIncidentDetail, role: ${role} returning true` );
				return true;
			}
		}
		return false;
	}
	//
}
// ===========================================================================
