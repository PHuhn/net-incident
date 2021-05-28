// ===========================================================================
// File: app.component.spec.ts
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';
//
import { HttpClientModule, HttpClient, HttpResponse, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
//
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Menubar, MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
//
import { APP_COMPONENTS } from './APP.COMPONENTS';
import { APP_PROVIDERS } from './APP.PROVIDERS';
import { APP_MODULE_PRIMENG } from './APP.MODULE-PRIMENG';
import { BaseCompService } from './common/base-comp/base-comp.service';
import { AlertsService } from './global/alerts/alerts.service';
import { AuthService } from './net-incident/services/auth.service';
import { AlertsComponent } from './global/alerts/alerts.component';
import { HeaderComponent } from './public/header/header.component';
import { FormsModule } from '@angular/forms';
//
describe('AppComponent', () => {
	let sut: AppComponent;
	let http: HttpClient;
	let backend: HttpTestingController;
	let fixture: ComponentFixture< AppComponent >;
	let baseService: BaseCompService;
	let alertService: AlertsService;
	const authServiceSpy =
		jasmine.createSpyObj( 'AuthService', ['logout']);
	//
	beforeEach( waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				FormsModule,
				RouterTestingModule,
				BrowserAnimationsModule,
				HttpClientModule,
				HttpClientTestingModule,
				APP_MODULE_PRIMENG
			],
			declarations: [
				AppComponent,
				ConfirmDialog,
				Menubar,
				APP_COMPONENTS
			],
			providers: [
				BaseCompService,
				AlertsService,
				ConfirmationService,
				{ provide: AuthService, useValue: authServiceSpy }
			]
		} );
		baseService = TestBed.inject( BaseCompService );
		alertService = baseService._alerts;
		http = TestBed.inject( HttpClient );
		backend = TestBed.inject( HttpTestingController );
		TestBed.compileComponents( );
	} ) );
	//
	beforeEach(() => {
		fixture = TestBed.createComponent( AppComponent );
		sut = fixture.componentInstance;
		fixture.detectChanges( );
	});
	//
	it('should create the app', () => {
		console.log( 'AppComponent' );
		// given / when / then
		expect( sut ).toBeTruthy();
	});
	//
	it('should contain ConfirmDialog with key of delete ...', () => {
		// given / when
		const confirm: ConfirmDialog = fixture.debugElement.query(
			By.css( 'p-confirmdialog' )).componentInstance;
		// then
		expect( confirm.key ).toEqual( 'delete' );
	});
	//
	it('should contain Alert component ...', () => {
		// given / when
		const alerts: AlertsComponent = fixture.debugElement.query(
			By.css( 'app-alerts' )).componentInstance;
		// then
		expect( alerts ).toBeDefined( );
	});
	//
	// onAuthLogout(event): void
	//
	it('onAuthLogout: should unset login ...', () => {
		// given
		sut.authenticated = true;
		authServiceSpy.logout.and.returnValue( { } );
		// when
		sut.onAuthLogout( 0 );
		// then
		expect( sut.authenticated ).toEqual( false );
	});
	//
	// fakeLogin()
	//
	it('fakeLogin: should unset login ...', () => {
		// given
		sut.authenticated = false;
		// when
		sut.fakeLogin( );
		// then
		expect( sut.user.UserName ).toEqual( 'Phil' );
		expect( sut.authenticated ).toEqual( true );
	});
	//
	// onAuthenticated( user: User ): void
	//
	it('onAuthenticated: should login ...', () => {
		// given
		sut.fakeLogin( );
		// when
		sut.onAuthenticated( sut.user );
		// then
		expect( AppComponent.securityManager ).toBeDefined( );
		expect( sut.authenticated ).toEqual( true );
	});
	//
});
// ===========================================================================
