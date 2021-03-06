import { Component, OnInit, Input } from '@angular/core';
//
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
//
import { SelectItemClass } from '../../global/select-item-class';
import { ServerSelectionWindowComponent } from '../../net-incident/server-selection-window/server-selection-window.component';
//
@Component({
	selector: 'app-testing',
	templateUrl: './testing.component.html'
})
export class TestingComponent {
	//
	private codeName: string = 'Testing-Component';
	notetype: number = 1;
	notetypes: SelectItem[];
	selected: string = '';
	//
	model: SelectItem[];
	displayServersWindow: boolean = false;
	//
	constructor() {
		//
		this.notetypes = [
			new SelectItemClass( 1, 'Ping' ),
			new SelectItemClass( 2, 'ISP Rpt' ),
			new SelectItemClass( 3, 'ISP Addl' ),
			new SelectItemClass( 4, 'ISP Resp' )
		];
		//
		this.model = [
			new SelectItemClass( 'nsg-1', 'Router 1' ),
			new SelectItemClass( 'nsg-2', 'Router 2' ),
			new SelectItemClass( 'nsg-3', 'Web Server' )
		];
		//
	}
	//
	// Window/dialog communication (also see onClose event)
	//
	showDialog() {
		this.displayServersWindow = true;
	}
	//
	serverSelected( event: any ) {
		console.log( 'selected: ' + event );
		this.selected = event;
	}
	//
	// on server-selection-window closed
	//
	onClose( saved: string ) {
		console.log('Entering: on close with: ' + saved );
		this.selected = saved;
		this.displayServersWindow = false;
	}
	//
}
