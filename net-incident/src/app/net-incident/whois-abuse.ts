// ===========================================================================
import { environment } from '../../environments/environment';
//
export interface IWhoIsAbuse {
	nic: string;
	net: string;
	abuse: string;
	inet: string;
	//
	GetWhoIsAbuse( data: string ): void;
	//
	ParseWhoIsData( data: string ): any[];
	//
	GetNIC( raw: string ): string;
	//
	BadAbuseEmail(): boolean;
}
//
// using whois data try to find the abuse e-mail address
//
export class WhoIsAbuse implements IWhoIsAbuse {
	public nic: string;
	public net: string;
	public abuse: string;
	public inet: string;
	private logLevel: number = environment.logLevel;
	//
	private emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	//
	netSolutions = environment.NetSolutionsNIC;
	//
	constructor() {
		this.nic = ''; this.net = ''; this.abuse = ''; this.inet = '';
	}
	//
	// returns: this class { nic, net, abuse, inet }
	//
	GetWhoIsAbuse( data: string ): void {
		const parsed = this.ParseWhoIsData( data );
		const nic = this.GetNIC( data );
		// now get net and abuse e-mail
		if( this.netSolutions.includes( nic ) ) {
			this.ProcessNetSolutions( nic, data );
		} else {
			if ( nic === 'twnic.net') {
				this.ProcessTw( nic, data );
			} else {
				this.ProcessParsed( nic, parsed );
			}
		}
	}
	//
	// https://www.npmjs.com/package/parse-whois
	// parse to { "attribute": <attr ~key>, "value": <value> }
	ParseWhoIsData( data: string ): any[] {
		let attr: string;
		let colonPos: number;
		let endTextStr: string = '';
		let returnArray: any[] = [];
		//
		data.split( '\n' ).forEach( ( part ) => {
			if( !part ) { return; }
			colonPos = part.indexOf( ': ' );
			attr = part.substr( 0, colonPos );
			if( attr !== '' ) {
				returnArray.push( {
					'attribute': attr,
					'value': part.substr( colonPos + 1 ).trim( ).replace(/(\r\n|\n|\r)/gm,'')
				} );
			} else {
				endTextStr += part.substr(colonPos+1).trim() + '\n';
			}
		});
		returnArray.push( { 'attribute': 'End Text', 'value': endTextStr } );
		//
		return returnArray;
	}
	//
	// Get the NIC that returned the data
	// returns: string of the NIC
	//
	GetNIC( raw: string ): string {
		let nic = '';
		if( raw !== '' ) {
			const lines = raw.split( '\n' );
			for (let i = 0; i < 8; i++) {
				// allow for redirection, [Redirected to whois.ripe.net]
				const line = lines[i];
				if( line.substr( 0, 1 ) === '[' ) {
					let pos = line.indexOf( 'whois.' );
					if( pos === -1 ) {
						// [vault.krypt.com] length is the same!
						pos = line.indexOf( 'vault.' );
					}
					if( pos > -1 ) {
						const parts = line.substr( pos ).split( '.' );
						nic = line.substr( pos+6, line.indexOf( ']' ) - ( pos+6 ) );
						if( parts[1] === 'registro' ) {
							nic = nic.replace(/registro/,'nic');
						}
					}
				} else {
					i = 8; // teminate loop
				}
			}
		}
		this.nic = nic;
		return nic;
	}
	//
	// process the raw data from whois
	// returns: this class { nic, net, abuse, inet }
	ProcessNetSolutions( nic: string, raw: string ) {
		let net = '', abuse = '', inet = '';
		const lines = raw.split( '\n' );
		const netAtt = [ 'customer organization', 'org-name' ];
		const inetAtt = [ 'ip-network' ];
		const abuseAtt = [ 'abuse-email', 'abuse-contact;i' ];
		raw.split( '\n' ).forEach( ( line ) => {
			const flds = line.split( ':' );
			if( this.netSolutions.includes( nic ) ) {
				if( flds.length > 2 ) {
					const attrib: string = flds[1].toLowerCase( );
					if( netAtt.includes( attrib ) ) { net = flds[2].replace(/(\r\n|\n|\r)/gm,''); }
					if( abuseAtt.includes( attrib ) ) { abuse = flds[2].replace(/(\r\n|\n|\r)/gm,''); }
					if( inetAtt.includes( attrib ) ) { inet = flds[2].replace(/(\r\n|\n|\r)/gm,''); }
				}
			}
		});
		// console.log ( 'In ProcessRaw: ' + nic + ', net: ' + net + ', abuse: ' + abuse );
		this.nic = nic; this.net = net; this.abuse = abuse; this.inet = inet;
		if( this.BadAbuseEmail() ) {
			this.abuse = '';
		}
		return { 'nic': nic, 'net': net, 'abuse': abuse, 'inet': inet };
	}
	//
	// process the raw data from whois
	// returns: this class { nic, net, abuse, inet }
	ProcessTw( nic: string, raw: string ) {
		let net = '', abuse = '', inet = '';
		const lines: string[] = raw.split( '\n' );
		let prvs: string[] = [];
		raw.split( '\n' ).forEach( ( line ) => {
			const flds: string[] = line.trim().split( ':' );
			if( flds.length > 1 ) {
				const attrib: string = flds[0].toLowerCase( );
				if( attrib === 'netname' ) { net = flds[1].trim().replace(/(\r\n|\n|\r)/gm,''); }
				if( attrib === 'netblock' ) { inet = flds[1].replace(/(\r\n|\n|\r)/gm,''); }
			} else {
				if( prvs.length > 1 ) {
					// Technical contact:
					// network-adm@hinet.net
					const attrib: string = prvs[0].toLowerCase( );
					if( attrib === 'technical contact' ) {
						abuse = flds[0].trim().replace(/(\r\n|\n|\r)/gm,'');
					}
				}
			}
			prvs = flds;
		});
		// console.log ( 'In ProcessRaw: ' + nic + ', net: ' + net + ', abuse: ' + abuse );
		this.nic = nic; this.net = net; this.abuse = abuse; this.inet = inet;
		if( this.BadAbuseEmail() ) {
			this.abuse = '';
		}
		return { 'nic': nic, 'net': net, 'abuse': abuse, 'inet': inet };
	}
	//
	// process the parsed data from whois
	// returns: this class { nic, net, abuse, inet }
	ProcessParsed( nic: string, parsed: any[] ) {
		// console.log( 'ProcessParsed: ' + nic + ', ' + parsed[0].value );
		let net = '', abuse = '', inet = '';
		// default values to search for...
		let netAtt = [ 'customer', 'custname', 'netname' ];
		let inetAtt = [ 'inetnum', 'netrange' ];
		let abuseAtt = [ 'abuse-mailbox', 'orgabuseemail' ];
		if( nic === 'lacnic.net' ) {
			netAtt = [ 'owner' ];
			// keep default inet
			abuseAtt = [ 'e-mail' ];
		} else if( nic === 'nic.br' ) {
			netAtt = [ 'owner' ];
			// keep default inet
			abuse = 'cert@cert.br'; // hard assignment
		} else if ( nic === 'krnic.net' ) {
			netAtt = [ 'organization name' ];
			inetAtt = [ 'ipv4 address' ];
			abuseAtt = [ 'e-mail' ];
		}
		if( parsed.length > 0 ) {
			if( abuse === '' ) {
				// parse through the comments to fine the abuse e-mail address
				const endTextStr: string = parsed[ parsed.length - 1 ].value;
				endTextStr.split( '\n' ).forEach( ( line ) => {
					if( !line ) { return; }
					const flds = line.split( ' ' );
					if( flds.length > 2 ) {
						// % Abuse contact for '145.255.0.0 - 145.255.15.255' is 'abuse@ufanet.ru'
						if( flds[0] === '%' && flds[1].toLowerCase( ) === 'abuse' ) {
							if( this.logLevel >= 4 ) {
								console.log( line );
							}
							const abuseLine = line.split( `'` );
							abuse = abuseLine[ abuseLine.length - 2 ];
						}
					}
				});
			}
			for (const obj of parsed) {
				const attrib: string = obj.attribute.trim().toLowerCase();
				if( net === '' ) {
					if( netAtt.includes( attrib ) ) {
						net = obj.value;
					}
				}
				if( inet === '' ) {
					if( inetAtt.includes( attrib ) ) {
						inet = obj.value;
					}
				}
				if( abuse === '' ) {
					if( abuseAtt.includes( attrib ) ) {
						abuse = obj.value;
					}
				}
			}
		}
		// let netHex = net.split ('').map (function (c) { return c.charCodeAt (0); });
		this.nic = nic; this.net = net; this.abuse = abuse; this.inet = inet;
		if( this.BadAbuseEmail() ) {
			this.abuse = '';
		}
		return { 'nic': nic, 'net': net, 'abuse': abuse, 'inet': inet };
	}
	//
	// Is this a bad abuse e-mail address.
	//
	BadAbuseEmail(): boolean {
		if( this.abuse === '' ) {
			return true;
		}
		const badAbuse = environment.BadAbuseEmailAddresses;
		// [ 'hostmaster@nic.ad.jp', 'abuse@ripe.net' ]
		if( badAbuse.includes( this.abuse ) ) {
			return true;
		}
		return !this.ValidateEmail( this.abuse );
	}
	//
	//  Is this a valid email address.
	//
	ValidateEmail( email ): boolean {
		return this.emailRE.test(String(email).toLowerCase());
	}
	//
}
// ===========================================================================
