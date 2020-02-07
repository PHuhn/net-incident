// ===========================================================================
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
//
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Header, Footer } from 'primeng/api';
import { SelectItem } from 'primeng/api';
//
import { ServerSelectionWindowComponent } from './server-selection-window.component';
import { SelectItemClass } from '../select-item-class';
//
describe('ServerSelectionWindowComponent', () => {
	let sut: ServerSelectionWindowComponent;
	let fixture: ComponentFixture<ServerSelectionWindowComponent>;
	//
	const windowTitleSelector: string =
		'#serverSelectionWindow > div.ui-dialog > div.ui-dialog-titlebar';
	const expectedWindowTitle: string = 'Select a server';
	const mockData: SelectItem[] = [
		new SelectItemClass( 'nsg-1', 'Router 1' ),
		new SelectItemClass( 'nsgServ2', 'Router 2' ),
		new SelectItemClass( 'nsg-3', 'Web Server' )
	];
	const displayWindow: boolean = true;
	//
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ FormsModule,
				BrowserAnimationsModule
			],
			declarations: [
				ServerSelectionWindowComponent,
				Dialog, Header, Footer
			]
		})
		.compileComponents();
	}));
	//
	beforeEach(() => {
		fixture = TestBed.createComponent(ServerSelectionWindowComponent);
		sut = fixture.componentInstance;
		sut.selectItems = mockData;
		sut.displayWin = displayWindow;
		fixture.detectChanges();
	});
	//
	it('should be created ...', () => {
		console.log(
			'===================================\n' +
			'ServerSelectionWindowComponent should create ...' );
		expect(sut).toBeTruthy();
		});
	//
	it('should initialize (input) with all server data ...', () => {
		expect(sut.model.length).toEqual(mockData.length);
	});
	//
	it('should accept display window (input) ...', () => {
		expect(sut.displayWin).toEqual(displayWindow);
	});
	//
	it('should launch window when display window set ...', () => {
		const title: HTMLDivElement = fixture.debugElement.query(By.css(
			windowTitleSelector )).nativeElement;
		expect( title.innerText ).toEqual( expectedWindowTitle );
		sut.displayWin = false;
	});
	//
	it('should return selected server 0 ...', fakeAsync( () => {
		const idx: number = 0;
		const server: SelectItem = mockData[ idx ];
		const value: string = server.value;
		const radioSelector: string =
			`#serverSelectionWindow > div.ui-dialog > div.ui-dialog-content > div > div > div:nth-child(${idx + 1}) > input[type="radio"]`;
		const radio: HTMLInputElement = fixture.debugElement.query(By.css(
			radioSelector )).nativeElement;
		// console.log( radio );
		spyOn( sut.onClose, 'emit' );
		expect( radio.checked ).toBeFalsy(); // default state
		//
		radio.click();
		expect( sut.onClose.emit ).toHaveBeenCalledWith( value );
		sut.displayWin = false;
	}));
	//
	it('should return selected server 1 ...', fakeAsync( () => {
		const idx: number = 1;
		const server: SelectItem = mockData[ idx ];
		const value: string = server.value;
		const radioSelector: string =
			`#serverSelectionWindow > div.ui-dialog > div.ui-dialog-content > div > div > div:nth-child(${idx + 1}) > input[type="radio"]`;
		const radio: HTMLInputElement = fixture.debugElement.query(By.css(
			radioSelector )).nativeElement;
		// console.log( radio );
		spyOn( sut.onClose, 'emit' );
		expect( radio.checked ).toBeFalsy(); // default state
		//
		radio.click();
		expect( sut.onClose.emit ).toHaveBeenCalledWith( value );
		sut.displayWin = false;
	}));
	//
});
// ===========================================================================
