// ===========================================================================
// File: login.ts
//
import { Message } from '../global/message';
//
export class Login {
	// using short-hand declaration...
	constructor(
		public UserName: string,
		public Password: string,
		public ServerShortName: string
	) { }
	//
	// Class validation rules.
	//
	validate( ): Message[] {
		let errMsgs: Message[] = [];
		//
		if( this.UserName.length === 0 || this.UserName === undefined ) {
			errMsgs.push( new Message( 'UserName-1', `'User Name' is required.` ) );
		}
		if( this.UserName.length > 256 ) {
			errMsgs.push( new Message( 'UserName-2', `'User Name' max length of 256.` ) );
		}
		if( this.Password.length === 0 || this.Password === undefined ) {
			errMsgs.push( new Message( 'Password-1', `'Password' is required.` ) );
		}
		if( this.Password.length > 128 ) {
			errMsgs.push( new Message( 'Password-2', `'Password' max length of 128.` ) );
		}
		//
		return errMsgs;
		}
}
//
// ===========================================================================
