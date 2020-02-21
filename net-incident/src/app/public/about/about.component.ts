// ===========================================================================
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
	//
	applicationName = 'Network Incident';
	companyName = 'Northern Software Group';
	copyright ='Copyright © 2020';
	// (angular version).major.minor.build
	ng_version ='9';
	version ='9.1.0.24';
	//
	constructor() { }
	//
	ngOnInit() {
	}
	//
}
// ===========================================================================
