// ===========================================================================
// File: register.component.spec.ts
import { ComponentFixture, TestBed, inject, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
//
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { Header, Footer } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { Alerts } from '../../global/alerts/alerts';
import { AlertLevel } from '../../global/alerts/alert-level.enum';
import { TokenResponse } from '../../net-incident/token-response';
import { User } from '../../net-incident/user';
import { UserService } from '../../net-incident/services/user.service';
import { AuthService } from '../../net-incident/services/auth.service';
import { ConsoleLogService } from '../../global/console-log/console-log.service';
import { BaseCompService } from '../../common/base-comp/base-comp.service';
import { LoginComponent } from './login.component';
import { ServerSelectionWindowComponent } from '../../net-incident/server-selection-window/server-selection-window.component';
//
describe('LoginComponent', () => {
	let sut: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let alertService: AlertsService;
	let baseService: BaseCompService;
	let consoleService: ConsoleLogService;
	// Create a fake TwainService object with a `getQuote()` spy
	const authServiceSpy = jasmine.createSpyObj('AuthService',
				['authenticate', 'logout', 'isLoggedIn', 'isLoggedOut']);
	const userServiceSpy = jasmine.createSpyObj('UserService',
			['emptyUser', 'getUser', 'getUserServer']);
	//
	beforeEach(waitForAsync(() => {
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
				Footer,
				ServerSelectionWindowComponent
			],
			providers: [
				BaseCompService,
				AlertsService,
				ConsoleLogService,
				ConfirmationService,
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: UserService, useValue: userServiceSpy }
			]
		} );
		baseService = TestBed.inject( BaseCompService );
		alertService = baseService._alerts;
		consoleService = baseService._console;
		TestBed.compileComponents();
	}));
	//
	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		sut = fixture.componentInstance;
		fixture.detectChanges();
	});
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
	// test of loginUser, validation failure
	//
	it('loginUser should fail login when invalid password ...', fakeAsync( ( ) => {
		//
		sut.model.UserName = 'Xyz';
		sut.model.Password = '';
		sut.model.ServerShortName = 'XyzServer';
		alertService.getAlerts().subscribe( (msg: Alerts) => {
			expect( msg ).toBeTruthy( );
			expect( msg.level ).toBe( AlertLevel.Error );
		}, error =>	console.error( error ) );
		const ret: number = sut.loginUser();
		expect( ret ).toBe( -1 );
		//
	} ) );
	//
	// test of loginUser, fail with bad username or password
	//
	it('loginUser should fail login when bad username or password ...', fakeAsync( ( ) => {
		//
		sut.model.UserName = 'Xyz';
		sut.model.Password = 'Xyz';
		sut.model.ServerShortName = 'XyzServer';
		const errMsg: string = 'Fake Service error';
		authServiceSpy.authenticate.and.returnValue(throwError( errMsg ));
		alertService.getAlerts().subscribe( (msg: Alerts) => {
			expect( msg ).toBeTruthy( );
			expect( msg.level ).toBe( AlertLevel.Error );
		}, error =>	console.error( error ) );
		const ret: number = sut.loginUser();
		expect( ret ).toBe( 0 );
		//
	} ) );
	//
	// test of loginUser, succeed
	//
	it('loginUser should succeed to login user ...', fakeAsync( ( ) => {
		//
		sut.model.UserName = 'Xyz';
		sut.model.Password = 'Xyz';
		sut.model.ServerShortName = 'XyzServer';
		const tokenResp: TokenResponse = new TokenResponse(
			'1111', 'bearer', 1000, sut.model.UserName);
		authServiceSpy.authenticate.and.returnValue(of( tokenResp ));
		const emptyUser: User = new User(
			'','','','','','','',false,'',false,0,[],'',undefined, []);
		emptyUser.ServerShortName = sut.model.ServerShortName;
		userServiceSpy.getUserServer.and.returnValue(of( emptyUser ));
		sut.onClose.subscribe( user => {
			expect( user ).toBe( emptyUser );
		} );
		const ret: number = sut.loginUser();
		expect( ret ).toBe( 0 );
		//
	} ) );
	//
	// test of getUserServer, succeed
	//
	it('getUserServer should get login user ...', fakeAsync( ( ) => {
		//
		sut.model.UserName = 'Xyz';
		sut.model.ServerShortName = 'XyzServer';
		const emptyUser: User = new User(
			'','','','','','','',false,'',false,0,[],'',undefined, []);
		emptyUser.ServerShortName = sut.model.ServerShortName;
		userServiceSpy.getUserServer.and.returnValue(of( emptyUser ));
		sut.onClose.subscribe( user => {
			expect( user ).toBe( emptyUser );
		} );
		sut.getUserServer( sut.model.UserName, sut.model.ServerShortName );
		//
	} ) );
	//
	// test of onServerSelected, succeed
	//
	it('onServerSelected should get login user ...', fakeAsync( ( ) => {
		//
		const serverShortName = 'XyzServer';
		sut.model.UserName = 'Xyz';
		sut.model.Password = 'Xyz';
		sut.model.ServerShortName = '';
		const emptyUser: User = new User(
			'','','','','','','',false,'',false,0,[],'',undefined, []);
		emptyUser.ServerShortName = serverShortName;
		userServiceSpy.getUserServer.and.returnValue(of( emptyUser ));
		sut.onClose.subscribe( user => {
			expect( sut.model.ServerShortName ).toEqual( serverShortName );
		} );
		sut.onServerSelected( serverShortName );
		//
	} ) );
	//
});
// ===========================================================================
