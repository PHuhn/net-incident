// ===========================================================================
//	File: register.component.spec.ts
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, throwError } from 'rxjs';
//
import { SelectItem } from '../../../../node_modules/primeng/components/common/selectitem';
import { Dialog } from '../../../../node_modules/primeng/components/dialog/dialog';
import { Header, Footer } from '../../../../node_modules/primeng/components/common/shared';
import { ButtonModule } from '../../../../node_modules/primeng/components/button/button';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { UserService } from '../../net-incident/services/user.service';
import { UserServiceMock } from '../../net-incident/services/mocks/UserService.mock';
import { AuthService } from '../../net-incident/services/auth.service';
import { LoginComponent } from './login.component';
import { ServerSelectionWindowComponent } from '../../net-incident/server-selection-window/server-selection-window.component';
//
describe('LoginComponent', () => {
	let sut: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let alertService: AlertsService;
	let userServiceMock: UserServiceMock;
	// Create a fake TwainService object with a `getQuote()` spy
	const authService = jasmine.createSpyObj('AuthService',
				['authenticate', 'logout', 'isLoggedIn', 'isLoggedOut']);
	//
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				FormsModule,
				ButtonModule,
				BrowserAnimationsModule
			],
			declarations: [
				LoginComponent,
				Dialog,
				Header,
				ServerSelectionWindowComponent
			],
			providers: [
				{ provide: AlertsService, useClass: AlertsService },
				{ provide: AuthService, useValue: authService },
				{ provide: UserService, useClass: UserServiceMock }
			]
		} );
		alertService = TestBed.get( AlertsService );
		userServiceMock = TestBed.get( UserService );
		TestBed.compileComponents();
	}));
	//
	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		sut = fixture.componentInstance;
		fixture.detectChanges();
	});
	//
	// Run HttpTestingController's verify to make sure that there are no
	// outstanding requests.
	//
	afterEach(() => {
	});
	//
	it('should be created ...', () => {
		console.log(
			'=================================\n' +
			'LoginComponent: should create ...' );
		expect( sut ).toBeTruthy();
	});
	//
});
// ===========================================================================
