// ===========================================================================
// File: register.component.spec.ts
import { ComponentFixture, TestBed, inject, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
//
import { AlertsService } from '../../global/alerts/alerts.service';
import { UserService } from '../../net-incident/services/user.service';
import { IUser, User } from '../../net-incident/user';
import { RegisterComponent } from './register.component';
//
describe('RegisterComponent', () => {
	let sut: RegisterComponent;
	let alertService: AlertsService;
	let fixture: ComponentFixture<RegisterComponent>;
	const userServiceSpy = jasmine.createSpyObj('UserService',
		['emptyUser', 'getUser', 'getUserServer']);
	//
	beforeEach( waitForAsync( ( ) => {
		//
		TestBed.configureTestingModule({
			imports: [
				FormsModule,
				BrowserAnimationsModule
			],
			declarations: [ RegisterComponent ],
			providers: [
				AlertsService,
				{ provide: UserService, useValue: userServiceSpy }
			]
		} );
		alertService = TestBed.inject( AlertsService );
		TestBed.compileComponents();
	} ) );
	//
	// Instantiate fixture and the component
	//
	beforeEach(() => {
		fixture = TestBed.createComponent(RegisterComponent);
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
			'RegisterComponent: should create ...' );
		expect( sut ).toBeTruthy();
	});
});
// ===========================================================================
