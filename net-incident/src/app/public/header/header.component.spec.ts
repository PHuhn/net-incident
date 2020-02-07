import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
		expect( sut ).toBeTruthy();
	});
});
