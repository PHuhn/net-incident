// ===========================================================================
import { Component, OnInit,
		trigger, state, animate, transition, style
	} from '@angular/core';
import { Observable } from 'rxjs/Observable';
//
import { AlertLevel } from '../alert-level.enum';
import { Message } from '../message';
import { Alerts } from '../alerts';
import { AlertsService } from './alerts.service';
//
@Component({
	selector: 'app-alerts',
	animations: [
		trigger('visibilityChanged', [
			state('true' , style({ opacity: 1, transform: 'scale(1.0)' })),
			state('false', style({ opacity: 0, transform: 'scale(0.0)'	})),
			transition('1 => 0', animate('300ms')),
			transition('0 => 1', animate('300ms'))
		])
	],
	templateUrl: './alerts.component.html',
	styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
	showMsgs: boolean = false;
	level: AlertLevel = AlertLevel.Success;
	msgs: Message[] = [];
	//
	constructor( private _alertService: AlertsService ) {
	}
	//
	ngOnInit() {
		// console.log( 'AlertsComponent, OnInit ... ' );
		// Subscribe to the service
		// Will fire everytime other component use the set methods
		const subscription = this._alertService.getAlerts().subscribe(
					(alertMsg: Alerts) => {
			this.showMsgs = true;
			this.level = alertMsg.level;
			this.msgs = alertMsg.messages;
			// console.log( 'next message: ' + this.level.toString() );
		}, error =>	console.error( error ) );
	}
	//
	// close the message
	//
	onClick(): boolean {
		this.msgs = [];
		this.showMsgs = false;
		return false;
	}
	//
	// return the class for the message
	//
	getClass(): string {
		switch( +this.level ) {
			case AlertLevel.Error:
				return 'alertMessages nsg-msg-danger';
			case AlertLevel.Warning:
				return 'alertMessages nsg-msg-warning';
			case AlertLevel.Success:
				return 'alertMessages nsg-msg-success';
		}
		return 'alertMessages nsg-msg-info';
	}
	//
}
// ===========================================================================
