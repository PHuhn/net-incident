// ===========================================================================
import { ComponentFixture, TestBed, inject, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
//
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FocusTrapModule } from 'primeng/focustrap';
import { Header, Footer, SelectItem } from 'primeng/api';
//
import { ServerSelectionWindowComponent } from './server-selection-window.component';
import { SelectItemClass } from '../../global/select-item-class';
//
describe('ServerSelectionWindowComponent', () => {
	let sut: ServerSelectionWindowComponent;
	let fixture: ComponentFixture<ServerSelectionWindowComponent>;
	//
	const windowTitleSelector: string =
		'div.p-dialog-titlebar > span > p-header';
		// '#serverSelectionWindow > div.p-dialog > div.p-dialog-titlebar';
	const expectedWindowTitle: string = 'Select a server';
	const mockData: SelectItem[] = [
		new SelectItemClass( 'nsg-1', 'Router 1' ),
		new SelectItemClass( 'nsgServ2', 'Router 2' ),
		new SelectItemClass( 'nsg-3', 'Web Server' )
	];
	const displayWindow: boolean = true;
	//
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ FormsModule,
				FocusTrapModule,
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
		fixture.whenStable( );
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
		console.log( `win: ${sut.displayWin}  ${new Date().toISOString()}` );
		const titleVar = fixture.debugElement.query(By.css(
			'#serverSelectionWindow' )).nativeElement;
		const title: HTMLDivElement = fixture.debugElement.query(By.css(
			windowTitleSelector )).nativeElement;
		console.log( title );
		expect( title.innerText ).toEqual( expectedWindowTitle );
		sut.displayWin = false;
	});
	//
	it('should return selected server 0 ...', fakeAsync( () => {
		console.log( `selected win: ${sut.displayWin}  ${new Date().toISOString()}` );
		const idx: number = 0;
		const server: SelectItem = mockData[ idx ];
		const value: string = server.value;
		const radioSelector: string =
			`div.p-dialog-content > div > div > div:nth-child(${idx + 1}) > input[type=radio]`;
		const radio: HTMLInputElement = fixture.debugElement.query(By.css(
			radioSelector )).nativeElement;
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
			`div.p-dialog-content > div > div > div:nth-child(${idx + 1}) > input[type=radio]`;
		const radio: HTMLInputElement = fixture.debugElement.query(By.css(
			radioSelector )).nativeElement;
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
