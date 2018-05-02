//
import { IMessage } from './imessage';
// implements IMessage
export class Message {
	//
	id: string;
	message: string;
	//
	constructor(id: string, message: string) {
		this.id = id;
		this.message = message;
	}
}
