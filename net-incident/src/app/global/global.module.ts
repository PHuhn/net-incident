// File: global.module.ts
//	global.module
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//
//import { AlertsComponent } from './alerts/alerts.component';
//import { TruncatePipe } from './truncate.pipe';
//
@NgModule({
	imports: [
		CommonModule
	],
	exports : [
		CommonModule,
		FormsModule,
		BrowserModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		// include HttpClientModule after BrowserModule
		HttpClientModule,
		HttpModule,
		JsonpModule
	],
	declarations: [
	]
})
export class GlobalModule { }
