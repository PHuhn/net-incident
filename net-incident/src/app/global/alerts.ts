//
import { AlertLevel } from './alert-level.enum';
import { Message } from './message';
//
export class Alerts {
	//
	level: AlertLevel;
	messages: Message[];
	//
	constructor(alertLevel: AlertLevel, messages: Message[]) {
		this.level = alertLevel;
		this.messages = messages;
	}
}
