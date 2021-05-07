// ===========================================================================
import { Component, OnInit } from '@angular/core';
//
@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
	//
	applicationName = 'Network Incident';
	companyName = 'Northern Software Group';
	contactName ='Phil Huhn';
	contactEmail ='PhilHuhn@yahoo.com';
	githubLink = 'https://github.com/PHuhn?tab=repositories';
	//
	constructor() { }
	//
	ngOnInit() {
	}
	//
}
// ===========================================================================
