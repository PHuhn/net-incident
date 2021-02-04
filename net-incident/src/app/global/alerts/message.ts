// ===========================================================================
// File: message.ts
export interface IMessage {
	//
	id: string;
	message: string;
	//
}
//
export class Message implements IMessage {
	//
	id: string;
	message: string;
	//
	constructor(id: string, message: string) {
		this.id = id;
		this.message = message;
	}
}
// ===========================================================================
