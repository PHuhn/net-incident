// ===========================================================================
// File: login-view-model.ts
//
import { Message } from '../global/message';
//
export class LoginViewModel {
	// using short-hand declaration...
	public grant_type: string;
	//
	constructor(
		public username: string,
		public password: string
	) {
		this.grant_type = 'password';
	}
	//
	// Class validation rules.
	//
	/*
	validate( ): Message[] {
		let errMsgs: Message[] = [];
		//
		if( this.username.length === 0 || this.username === undefined ) {
			errMsgs.push( new Message( 'UserName-1', "'User Name' is required." ) );
		}
		if( this.username.length > 256 ) {
			errMsgs.push( new Message( 'UserName-2', "'User Name' max length of 256." ) );
		}
		if( this.password.length === 0 || this.password === undefined ) {
			errMsgs.push( new Message( 'Password-1', "'Password' is required." ) );
		}
		if( this.password.length > 128 ) {
			errMsgs.push( new Message( 'Password-2', "'Password' max length of 128." ) );
		}
		//
		return errMsgs;
	}
	*/
}
//
// ===========================================================================
