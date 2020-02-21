// ===========================================================================
// File: server-selection-window.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
//
import { SelectItem } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
//
import { ConsoleLogService } from '../../global/console-log.service';
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
	public model: SelectItem[];
	//
	// --------------------------------------------------------------------
	// Inputs and emitted outputs
	// inputs: server and displayWin
	// outputs: onClose
	//
	@Input() set selectItems( selectItems: SelectItem[] ) {
		if( selectItems !== undefined ) {
			this._console.Information(
				`${this.codeName}: Selecting length: ${selectItems.length}, win: ${this.displayWin}` );
			this.model = selectItems;
		}
	}
	get selectItems(): SelectItem[] { return this.model; }
	//
	private displayWindow: boolean;
	@Input() set displayWin( displayWin: boolean ) {
		this._console.Information(
			`${this.codeName}.displayWin setter: win: ${displayWin}` );
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
		this._console.Information( `${this.codeName}: selected: ${shortName}` );
		event.target.checked = false;
		this.onClose.emit( shortName );
	}
	//
	// Constructor (inject services).
	//
	constructor(
			private _console: ConsoleLogService
		) { }
	//
	// On component initialization.
	//
	ngOnInit() { }
	//
}
// ===========================================================================
