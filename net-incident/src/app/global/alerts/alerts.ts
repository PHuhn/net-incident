// ===========================================================================
// File: alerts.ts
import { AlertLevel } from './alert-level.enum';
import { IMessage } from './message';
//
export class Alerts {
	//
	level: AlertLevel;
	messages: IMessage[];
	//
	constructor(alertLevel: AlertLevel, messages: IMessage[]) {
		this.level = alertLevel;
		this.messages = messages;
	}
}
// ===========================================================================
