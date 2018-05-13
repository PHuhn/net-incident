// File: app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//
import { DataTableModule } from '../../node_modules/primeng/components/datatable/datatable';
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
import { TruncatePipe } from './global/truncate.pipe';
import { RegisterComponent } from './public/register/register.component';
import { HeaderComponent } from './public/header/header.component';
//
@NgModule({
  declarations: [
  	AppComponent,
	  APP_COMPONENTS,
  	TruncatePipe,
	  HeaderComponent
  ],
  imports: [
  	BrowserModule,
	  AppRoutingModule,
  	GlobalModule,
	  DataTableModule,
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
