// ===========================================================================
// File: global.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
		HttpClientJsonpModule
	],
	declarations: [
	]
})
export class GlobalModule { }
// ===========================================================================
