// ===========================================================================
// blog.angular-university.io/angular-jwt-authentication/
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
//
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
	//
	intercept( req: HttpRequest<any>,
				next: HttpHandler): Observable<HttpEvent<any>> {
		//
		// console.log( 'AuthInterceptorService: Authorization header access_token' );
		const idToken = localStorage.getItem( 'access_token' );
		if ( idToken ) {
			const cloned = req.clone( {
				headers: req.headers.set( 'Authorization', 'Bearer ' + idToken )
			} );
			//
			return next.handle( cloned );
		} else {
			return next.handle( req );
		}
		//
	}
}
// ===========================================================================
