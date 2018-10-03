// File: app.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//
import { TableModule } from '../../node_modules/primeng/components/table/table';
import { DialogModule } from '../../node_modules/primeng/components/dialog/dialog';
import { ConfirmDialogModule } from '../../node_modules/primeng/components/confirmdialog/confirmdialog';
import { DropdownModule } from '../../node_modules/primeng/components/dropdown/dropdown';
import { MenubarModule } from '../../node_modules/primeng/components/menubar/menubar';
//
import { APP_PROVIDERS } from './APP.PROVIDERS';
import { APP_COMPONENTS } from './APP.COMPONENTS';
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
		TableModule,
		DialogModule,
		ConfirmDialogModule,
		DropdownModule,
		MenubarModule
	],
	providers: [
		APP_PROVIDERS
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
