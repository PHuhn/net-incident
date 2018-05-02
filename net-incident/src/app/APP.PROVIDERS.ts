// ===========================================================================
// HttpClient use HttpClientModule https://github.com/angular/angular/issues/11694
//
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
//
// infrastructure services
import { ConfirmationService } from '../../node_modules/primeng/components/common/confirmationservice';
import { AlertsService } from './global/alerts/alerts.service';
// user/auth services
import { UserService } from './net-incident/services/user.service';
import { AuthService } from './net-incident/services/auth.service';
// https://ryanchenkie.com/angular-authentication-using-the-http-client-and-http-interceptors
import { AuthInterceptorService } from './net-incident/services/auth-interceptor.service';
// application services
import { ServicesService } from './net-incident/services/services.service';
import { IncidentService } from './net-incident/services/incident.service';
import { NetworkIncidentService } from './net-incident/services/network-incident.service';
//
export const APP_PROVIDERS = [
    ConfirmationService,
    AlertsService,
    //
    UserService,
    AuthService,
    {
        // HttpClientModule in global.module.ts
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true
    },
    //
    ServicesService,
    IncidentService,
    NetworkIncidentService
];
// ===========================================================================
