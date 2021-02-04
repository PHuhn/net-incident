// ===========================================================================
// file: alerts.service.ts
import { Injectable } from '@angular/core';
//
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//
import { AlertLevel } from './alert-level.enum';
import { Message } from './message';
import { Alerts } from './alerts';
//
@Injectable()
export class AlertsService {
	/*
	** Send messages to the alert component that displays a message
	** in the upper right-hand corner of the screen.
	** Three different ways to use this:
	** 1) setWhereWhatSuccess/setWhereWhatInfo/setWhereWhatWarning/setWhereWhatError
	** 2) warningSet
	** 3) warningInit/warningAdd/warningPost/warningCount
	** See the unit test for examples of usage.
	*/
	private alerted: Message[] = [];
	private level: AlertLevel = AlertLevel.Error;
	private subject: Subject< Alerts > = new Subject< Alerts >();
	// Subscriber gets this to get the logged values.
	public getAlerts(): Observable< Alerts > {
		return this.subject.asObservable();
	}
	// Allow direct call
	public setAlerts( errs: AlertLevel, alerted: Message[] ): void {
		// console.log( 'setAlerts: ' + errs.toString() );
		this.subject.next( new Alerts( errs, alerted ) );
	}
	// Turn the two parameters into an array.
	private whereWhatMessages( msgs: Message[], where: string, what: string) {
		const count: number = msgs.length;
		where = ( where === '' ? '-' : where );
		what = ( what === '' ? '-' : what );
		msgs.push( new Message( `${count + 1}-WHERE`, where ) );
		msgs.push( new Message( `${count + 2}-WHAT`, what ) );
	}
	// Allow indirect call
	// Turn the two parameters into an array and display the alert.
	public setWhereWhatInfo( where: string, what: string ): void {
		const msgs: Message[] = [];
		this.whereWhatMessages( msgs, where, what );
		this.setAlerts( AlertLevel.Info, msgs );
	}
	// Allow indirect call
	// Turn the two parameters into an array and display the alert.
	public setWhereWhatSuccess( where: string, what: string ): void {
		const msgs: Message[] = [];
		this.whereWhatMessages( msgs, where, what );
		this.setAlerts( AlertLevel.Success, msgs );
	}
	// Allow indirect call
	// Turn the two parameters into an array and display the alert.
	public setWhereWhatWarning( where: string, what: string ): void {
		const msgs: Message[] = [];
		this.whereWhatMessages( msgs, where, what );
		this.setAlerts( AlertLevel.Warning, msgs );
	}
	// Allow indirect call
	// Turn the three parameters into a collection and
	// display the alert.  The err is an optional parameter.
	public setWhereWhatError( where: string, what: string, err: string ): void {
		const msgs: Message[] = [];
		this.whereWhatMessages( msgs, where, what );
		const count: number = msgs.length;
		err = ( err === '' ? '-' : err );
		msgs.push( new Message( `${count + 1}-ERR`, err ) );
		this.setAlerts( AlertLevel.Error, msgs );
	}
	/*
	** Warning validation error messages
	*/
	public warningSet( msgs: Message[] ): boolean {
		if( msgs.length > 0 ) {
			this.setAlerts( AlertLevel.Warning, msgs );
			return true;
		} else {
			console.log( 'Messages array empty.' );
		}
		return false;
	}
	/*
	** Initialize a validation warning
	*/
	public warningInit(): void {
		this.level = AlertLevel.Warning;
		this.alerted = [];
	}
	/*
	** Add a validation warning
	*/
	public warningAdd( warning: string ): boolean {
		const id: string =
			( this.alerted.length + 1 ).toString();
		if( warning !== '' ) {
			this.alerted.push( new Message( id, warning ));
			return true;
		} else {
			this.alerted.push( new Message( id, '-' ));
		}
		return false;
	}
	/*
	** Post a validation warning
	*/
	public warningPost( ): boolean {
		if( this.alerted.length > 0 ) {
			this.subject.next( new Alerts( this.level, this.alerted ) );
			return true;
		} else {
			console.log( 'Alerted message array empty.' );
		}
		return false;
	}
	/*
	** Return count of messages in Init/Add/Post alert process.
	*/
	public warningCount(): number {
		return this.alerted.length;
	}
	//
}
// ===========================================================================
