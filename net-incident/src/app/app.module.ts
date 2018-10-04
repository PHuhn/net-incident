// File: app.module.ts
import { NgModule } from '@angular/core';
//
import { APP_PROVIDERS } from './APP.PROVIDERS';
import { APP_COMPONENTS } from './APP.COMPONENTS';
import { APP_MODULE_PRIMENG } from './APP.MODULE-PRIMENG';
import { AppRoutingModule } from './app-routing.module';
import { GlobalModule } from './global/global.module';
import { AppComponent } from './app.component';
//
@NgModule({
	declarations: [
		AppComponent,
		APP_COMPONENTS
	],
	imports: [
		AppRoutingModule,
		GlobalModule,
		APP_MODULE_PRIMENG
	],
	providers: [
		APP_PROVIDERS
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
