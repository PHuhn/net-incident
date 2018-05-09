// ===========================================================================
import { Component, Output, OnInit, EventEmitter } from '@angular/core';
//
import { MenuItem } from '../../../../node_modules/primeng/components/common/menuitem';
import { Menubar, MenubarModule } from '../../../../node_modules/primeng/components/menubar/menubar';
import { environment } from '../../../environments/environment';
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
	codeName: string = 'Header-Component'
  title: string = 'Network Incidents';
  logLevel: number = 1;
  //
	// the constructor of this the header.component
	//
	constructor() { }
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
    // 1=error, 2=warning, 3=info, 4=verbose
    this.logLevel = environment.logLevel;
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
    if( this.logLevel >= 4 )
			console.log( `${this.codeName}.logout: Logout clicked.`);
		this.logout.emit(null);
		//
	}
}
// ===========================================================================
