import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
//
import { Menubar, MenubarModule } from 'primeng/menubar';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from './header.component';
//
describe('HeaderComponent', () => {
	let sut: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				MenubarModule
			],
			declarations: [ HeaderComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HeaderComponent);
		sut = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		console.log(
			'===================================\n' +
			'HeaderComponent should create ...' );
		expect( sut ).toBeTruthy();
	});
	//
	// Simulate a button clicked, by calling event method
	//
	it('manually call logout clicked event ...', fakeAsync(() => {
		//
		sut.logout.subscribe( nl => {
			console.log( 'In logout callback ...' );
			expect( nl ).toBeNull( );
		} );
		sut.logoutClicked( );
		//
	} ) );
	//
});
