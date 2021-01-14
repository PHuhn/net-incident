// ===========================================================================
import { Injectable } from '@angular/core';
//
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//
import { AlertLevel } from '../alert-level.enum';
import { Message } from '../message';
import { Alerts } from '../alerts';
//
@Injectable()
export class AlertsService {
	//
	private alerted: Message[];
	private level: AlertLevel;
	private subject: Subject< Alerts > = new Subject< Alerts >();
	//  Subscriber gets this to get the logged values.
	public getAlerts(): Observable< Alerts > {
		return this.subject.asObservable();
	}
	//  Allow direct call
	public setAlerts( errs: AlertLevel, alerted: Message[] ): void {
		// console.log( 'setAlerts: ' + errs.toString() );
		this.subject.next( new Alerts( errs, alerted ) );
	}
	//  Turn the two parameters into an array.
	private whereWhatMessages( msgs: Message[], where: string, what: string) {
		if ( msgs === undefined ) {
			msgs = [];
		}
		msgs.push( new Message( '1-WHERE', where ) );
		msgs.push( new Message( '2-WHAT', what ) );
	}
	// Allow indirect call
	// Turn the two parameters into an array and display the alert.
	public setWhereWhatInfo( where: string, what: string ): void {
		let msgs: Message[] = [];
		this.whereWhatMessages( msgs, where, what );
		this.setAlerts( AlertLevel.Info, msgs );
	}
	// Allow indirect call
	// Turn the two parameters into an array and display the alert.
	public setWhereWhatSuccess( where: string, what: string ): void {
		let msgs: Message[] = [];
		this.whereWhatMessages( msgs, where, what );
		this.setAlerts( AlertLevel.Success, msgs );
	}
	// Allow indirect call
	// Turn the two parameters into an array and display the alert.
	public setWhereWhatWarning( where: string, what: string ): void {
		let msgs: Message[] = [];
		this.whereWhatMessages( msgs, where, what );
		this.setAlerts( AlertLevel.Warning, msgs );
	}
	// Allow indirect call
	// Turn the three parameters into a collection and
	// display the alert.  The err is an optional parameter.
	public setWhereWhatError( where: string, what: string, err: string ): void {
		let msgs: Message[] = [];
		this.whereWhatMessages( msgs, where, what );
		msgs.push(new Message('3-ERR', err));
		this.setAlerts( AlertLevel.Error, msgs );
	}
	//
	// Warning validation error messages
	//
	public warningSet( msgs: Message[] ): boolean {
		if( msgs !== undefined ) {
			if( msgs.length > 0 ) {
				this.setAlerts( AlertLevel.Warning, msgs );
				return true;
			} else {
				console.log( 'Messages array empty.' );
			}
		} else {
			console.log( 'Messages array not initialized.' );
		}
		return false;
	}
	//
	// Initialize a validation warning
	//
	public warningInit(): void {
		this.level = AlertLevel.Warning;
		this.alerted = [];
	}
	//
	// Add a validation warning
	//
	public warningAdd( warning: string ): boolean {
		if( this.alerted !== undefined ) {
			const id: string =
				( this.alerted.length + 1 ).toString();
			this.alerted.push( new Message( id, warning ));
			return true;
		} else {
			console.log( 'Alerted message array not initialized.'  );
		}
		return false;
	}
	//
	// Post a validation warning
	//
	public warningPost( ): boolean {
		if( this.alerted !== undefined ) {
			if( this.alerted.length > 0 ) {
				this.subject.next( new Alerts( this.level, this.alerted ) );
				return true;
			}
		} else {
			console.log( 'Alerted message array not initialized.' );
		}
		return false;
	}
	//
}
// ===========================================================================
