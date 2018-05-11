// ===========================================================================
// File: email.ts
// Author: Phil Huhn
// Created Date: 2017-12-14
//
// SendGrid’s v3 Web API
// https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html
//
export class EmailAddress {
	email: string;
	name: string;
	constructor( email: string ) {
		this.email = email;
	}
}
//
export class EmailContent {
	type: string;   // "text/plain"
	value: string;
	constructor( body: string, type: string = 'text/plain' ) {
		this.value = body;
		if( body.substring(0,1) === '<' ) {
			this.type = 'text/html';
		} else {
			this.type = type;
		}
	}
}
//
export class EmailPersonalization {
	tos: EmailAddress[];
	ccs: EmailAddress[];
	bccs: EmailAddress[];
	subject: string;
	constructor( to: string, subject: string ) {
		this.tos = [];
		this.ccs = [];
		this.bccs = [];
		this.tos.push( new EmailAddress( to ) ); // = [ ...this.to, to ];
		this.subject = subject;
	}
}
//
export class EmailRequest {
	personalizations: EmailPersonalization[];
	from: EmailAddress;
	contents: EmailContent[];
	attachments: any[];
	subject: string;
	htmlContent: string;
	plainTextContent: string;
	//
	constructor(
		from: string,
		to: string,
		subject: string,
		body: string
	) {
		this.contents = [];
		this.personalizations = [];
		this.from = new EmailAddress( from );
		this.personalizations.push( new EmailPersonalization( to, subject ) );
		this.contents.push( new EmailContent( body ) );
		this.subject = subject;
	}
}
// ===========================================================================
