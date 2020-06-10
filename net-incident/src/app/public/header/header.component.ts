// ===========================================================================
import { Component, Output, OnInit, EventEmitter } from '@angular/core';
//
import { MenuItem } from 'primeng/api';
import { Menubar, MenubarModule } from 'primeng/menubar';
import { environment } from '../../../environments/environment';
import { ConsoleLogService } from '../../global/console-log.service';
//
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	//
	// ------------------------------------------------------------------------
	// Data declaration.
	//
	codeName: string = 'Header-Component';
	title: string = 'Network Incidents';
	//
	// the constructor of this the header.component
	//
	constructor( private _console: ConsoleLogService ) { }
	//
	@Output() logout: EventEmitter<any> = new EventEmitter();
	//
	// Prime NG menu
	//
	items: MenuItem[];
	/*
		export interface MenuItem {
			label?: string;
			icon?: string;
			command?: (event?: any) => void;
			url?: string;
			routerLink?: any;
			items?: MenuItem[];
			expanded?: boolean;
			disabled?: boolean;
			visible?: boolean;
			target?: string;
			routerLinkActiveOptions?: any;
			separator?: boolean;
			badge?: string;
			badgeStyleClass?: string;
			style?: any;
			styleClass?: string;
			title?: string;
		}
	*/
	ngOnInit() {
		//
		this.items = [{
			label: `${this.title}`,
			routerLink: '/home'
		},
		{
			label: 'Help',
			items: [
				{label: 'About', routerLink: ['/about']},
				{label: 'Contacts', routerLink: ['/contacts']},
				{label: 'Help', routerLink: ['/help']}
			]
		}];
		//
	}
	//
	logoutClicked( ) {
		//
		this._console.Information(
			`${this.codeName}.logout: Logout clicked.`);
		this.logout.emit(null);
		//
	}
}
// ===========================================================================
