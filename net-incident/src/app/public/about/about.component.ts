// ===========================================================================
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
	//
	applicationName = 'Network Incident';
	companyName = 'Northern Software Group';
	copyright ='Copyright © 2021';
	// (angular version).major.minor.build
	ng_version ='11';
	version ='11.1.0.34';
	//
	constructor() { }
	//
	ngOnInit() {
	}
	//
}
// ===========================================================================
