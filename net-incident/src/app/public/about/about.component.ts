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
	copyright ='Copyright © 2019';
	// (angular version).major.minor.build
	version ='8.1.0.20';
	//
	constructor() { }
	//
	ngOnInit() {
	}
	//
}
// ===========================================================================
