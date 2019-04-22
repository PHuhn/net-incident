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
	// major.minor.build.(angular version)
	version ='1.0.18.7';
	//
	constructor() { }
	//
	ngOnInit() {
	}
	//
}
// ===========================================================================
