// ===========================================================================
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html'
})
export class AboutComponent {
	//
	applicationName = 'Network Incident';
	companyName = 'Northern Software Group';
	copyright ='Copyright © 2021';
	// (angular version).major.minor.build
	ng_version ='12';
	version ='12.1.0.34';
	//
	constructor() { }
	//
}
// ===========================================================================
