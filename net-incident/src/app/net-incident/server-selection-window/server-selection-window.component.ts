// ===========================================================================
// File: server-selection-window.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';
//
import { SelectItem } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
//
@Component({
	selector: 'app-server-selection-window',
	templateUrl: './server-selection-window.component.html'
})
export class ServerSelectionWindowComponent implements OnInit {
	//
	// --------------------------------------------------------------------
	// Data declaration.
	//
	private codeName: string = 'Server-Selection-Component';
	private logLevel: number = 1;
	public model: SelectItem[];
	//
	// --------------------------------------------------------------------
	// Inputs and emitted outputs
	// inputs: server and displayWin
	// outputs: onClose
	//
	@Input() set selectItems( selectItems: SelectItem[] ) {
		if( selectItems !== undefined ) {
			if( this.logLevel >= 4 ) {
				console.log( `${this.codeName}: Selecting length: ${selectItems.length}, win: ${this.displayWin}` );
			}
			this.model = selectItems;
		}
	}
	get selectItems(): SelectItem[] { return this.model; }
	//
	private displayWindow: boolean;
	@Input() set displayWin( displayWin: boolean ) {
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}.displayWin setter: win: ${displayWin}` );
		}
		this.displayWindow = displayWin;
	}
	get displayWin(): boolean { return this.displayWindow; }
	//
	@Output() onClose = new EventEmitter<string>();
	//
	// Radio button selected event.
	// Emit a string of the selected server short name to the parent control.
	//
	serverSelected( event, shortName: string ) {
		if( this.logLevel >= 4 ) {
			console.log( `${this.codeName}: selected: ${shortName}` );
		}
		event.target.checked = false;
		this.onClose.emit( shortName );
	}
	//
	// Constructor (inject services).
	//
	constructor( ) { }
	//
	// On component initialization.
	//
	ngOnInit() {
		// 1=error, 2=warning, 3=info, 4=verbose
		this.logLevel = environment.logLevel;
	}
	//
}
// ===========================================================================
