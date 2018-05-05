// ===========================================================================
// File: abuse-email-report.ts
//
import { environment } from '../../environments/environment';
import { Message } from '../global/message';
import { IIncident, Incident } from './incident';
import { INetworkLog, NetworkLog } from './network-log';
import { NetworkIncident } from './network-incident';
import { IIncidentType, IncidentType } from './incident-type';
import { EmailAddress, EmailRequest } from './email';
//
export interface IAbuseEmailReport {
    //
    errMsgs: Message[];
    //
    IsValid( ): boolean;
    //
    Renderer( content: string, locals: any ): string;
    //
    ComposeEmail( ): string;
    //
}
//
// using the incident create an e-mail message
//
export class AbuseEmailReport implements IAbuseEmailReport {
    //
    public errMsgs: Message[] = [];
    //
    private selectedLogs: NetworkLog[];
    private incidTypes: number[];
    private debug: number = 0;
    //
    // constructor require the passing a full NetworkIncident,
    // which contains all of the information necessary to create
    // an email message.
    //
    constructor( private networkIncident: NetworkIncident ) {
        this.selectedLogs = this.networkIncident.networkLogs.filter( (el) => {
            return el.Selected === true;
        });
        if( this.debug > 0 ) {
            console.log( this.selectedLogs );
        }
        if( this.selectedLogs.length > 0 ) {
            this.incidTypes = this.selectedLogs.reduce( (u, current ) => {
                if( u.indexOf( current.IncidentTypeId ) < 0 ) u.push( current.IncidentTypeId );
                return u;
            }, [] );
        }
    }
    //
    // validate the network incident class that was passed in for the values
    // needed for the e-mail.
    //
    public IsValid( ): boolean {
		//
		if( this.networkIncident.incident.IncidentId === undefined || this.networkIncident.incident.IncidentId === null || this.networkIncident.incident.IncidentId === 0 ) {
			this.errMsgs.push( new Message( 'IncidentNoteId-1', "From Incident, 'Incident Id' is required." ) );
		}
		if( this.networkIncident.incident.ServerId === undefined || this.networkIncident.incident.ServerId === null || this.networkIncident.incident.ServerId === 0 ) {
			this.errMsgs.push( new Message( 'CompanyId-1', "From Incident, 'Company Id' is required." ) );
		}
		if( this.networkIncident.incident.AbuseEmailAddress === undefined || this.networkIncident.incident.AbuseEmailAddress === null || this.networkIncident.incident.AbuseEmailAddress === '' ) {
			this.errMsgs.push( new Message( 'EmailAddress-1', "From Incident, 'Email Address' is required." ) );
		}
		if( this.networkIncident.incident.IPAddress === '' || this.networkIncident.incident.IPAddress === undefined ) {
			this.errMsgs.push( new Message( 'ipAddress-1', "From Incident, 'IP Address' is required." ) );
		}
        // from user
		if( this.networkIncident.user.UserName === '' || this.networkIncident.user.UserName === undefined ) {
			this.errMsgs.push( new Message( 'UserName-1', "From User, 'User Name' is required." ) );
		}
		if( this.networkIncident.user.UserNicName === '' || this.networkIncident.user.UserNicName === undefined ) {
			this.errMsgs.push( new Message( 'UserNicName-1', "From User, 'User Nic Name' is required." ) );
		}   
		if( this.networkIncident.user.Email === '' || this.networkIncident.user.Email === undefined ) {
			this.errMsgs.push( new Message( 'UserEmailAddress-1', "From User, 'User Email Address' is required." ) );
		}
        // from server
		if( this.networkIncident.user.Server.ServerName === '' || this.networkIncident.user.Server.ServerName === undefined ) {
			this.errMsgs.push( new Message( 'ServerName-1', "From Server, 'Server Name' is required." ) );
		}
		if( this.networkIncident.user.Server.WebSite === '' || this.networkIncident.user.Server.WebSite === undefined ) {
			this.errMsgs.push( new Message( 'Device-1', "From Server, 'Web Site' is required." ) );
		}
		if( this.networkIncident.user.Server.ServerLocation === '' || this.networkIncident.user.Server.ServerLocation === undefined ) {
			this.errMsgs.push( new Message( 'ServerLocation-1', "From Server, 'Server Location' is required." ) );
		}
        if( this.networkIncident.user.Server.FromName === '' || this.networkIncident.user.Server.FromName === undefined ) {
			this.errMsgs.push( new Message( 'FromName-1', "From Server, 'From Name' is required." ) );
		}
		if( this.networkIncident.user.Server.FromNicName === '' || this.networkIncident.user.Server.FromNicName === undefined ) {
			this.errMsgs.push( new Message( 'FromNicName-1', "From Server, 'From Nic Name' is required." ) );
		}
		if( this.networkIncident.user.Server.FromEmailAddress === '' || this.networkIncident.user.Server.FromEmailAddress === undefined ) {
			this.errMsgs.push( new Message( 'FromEmailAddress-1', "From Server, 'From Email Address' is required." ) );
        }
        // detail logs
		if( this.selectedLogs.length === 0 ) {
			this.errMsgs.push( new Message( 'NetworkLog-1', "At least one 'Network Log' needs to be selected." ) );
		}
		//
        return ( this.errMsgs.length === 0 ? true : false );
    }
    //
    // Renderer lifted from the the following:
    //  ../node_modules/express-es6-template-engine/es6-renderer.js
    // example:
    //  Rendered( 'SQL Injection from ${IPAddress}', { IncidentId: 25, IPAddress: '127.0.0.1' } )
    //  ƒ anonymous(IncidentId,IPAddress /*``*/) { return `SQL Injection from ${IPAddress}`; }
    //
	public Renderer( content: string, locals: any ): string {
		const compile = (content: string, keys) =>
				Function(keys, 'return `' + content + '`;');
        const localsKeys: string[] = Object.keys(locals);
        if( this.debug > 0 )
            console.log( localsKeys );
		if( localsKeys.length > 0 || content !== '' ) {
            const localsValues: any[] = localsKeys.map(i => locals[i]);
            if( this.debug > 0 )
                console.log( localsValues );
			return compile( content, localsKeys )( ...localsValues );
		} else {
			return content;
		}
	}
    //
    // Compose an abuse email report from the network incident that was passed
    // in the constructor.  The followin is a sample e-mail message:
    //
    // Hi
    //
    // Stop the intrusion from your IP address 192.169.1.1.
    // This is testing SQL injection vulnerabilities.
    // Please contain the following reference # in all communications: 4
    //
    // Web-site address: www.nsg.com
    // We are in Michigan, USA.
    // Incident times:
    // Sat Mar 10 2018 23:00:00 GMT-0500 (Eastern Standard Time) EST (UTC-5)
    // Sun Mar 11 2018 03:01:00 GMT-0400 (Eastern Daylight Time) EDT (UTC-4)
    //
    // Thank you,
    // Phil Huhn
    // ================
    //
    // Log incident 1
    // --------------------------------
    // Log incident 2
    // --------------------------------
    //
    public ComposeEmail( ): string {
        // is the data valid, if not return
        if( !this.IsValid( ) ) {
            return this.errMsgs.join( ';  ' );
        }
        const template: IncidentType = this.GetTemplate( );
        if( template === undefined ) {
            return 'Email Template error: not found.'
        }
        try {
            const abuse: string = this.networkIncident.incident.AbuseEmailAddress;
            // Changes here need to also happen in the validation.
            const headerValues = {
                IncidentId: this.networkIncident.incident.IncidentId,
                AbuseEmailAddress: abuse,
                IPAddress: this.networkIncident.incident.IPAddress,
                IncidentTypeShortDesc: template.IncidentTypeShortDesc,
                IncidentTypeDesc: template.IncidentTypeDesc,
                UserName: this.networkIncident.user.UserName,
                UserNicName: this.networkIncident.user.UserNicName,
                UserEmailAddress: this.networkIncident.user.Email,
                ServerName: this.networkIncident.user.Server.ServerName,
                Device: this.networkIncident.user.Server.WebSite,
                ServerLocation: this.networkIncident.user.Server.ServerLocation,
                FromName: this.networkIncident.user.Server.FromName,
                FromNicName: this.networkIncident.user.Server.FromNicName,
                FromEmailAddress: this.networkIncident.user.Server.FromEmailAddress
            };
            const fromEmail: string = ( template.IncidentTypeFromServer ?
                this.networkIncident.user.Server.FromEmailAddress : this.networkIncident.user.Email );
            const fromName: string = ( template.IncidentTypeFromServer ?
                this.networkIncident.user.Server.FromName : this.networkIncident.user.FullName );
            // the following 3 accept various header values
            const subject = this.Renderer( template.IncidentTypeSubjectLine, headerValues );
            const intro = this.Renderer( template.IncidentTypeEmailTemplate, headerValues );
            const thanks = this.Renderer( template.IncidentTypeThanksTemplate, headerValues );
            // the following 2 accept various values from the log record
            const times: string = this.IncidentLogDetails( template.IncidentTypeTimeTemplate ).join( '\n' );
            const logs: string = this.IncidentLogDetails( template.IncidentTypeLogTemplate ).join( '\n' );
            //
            let emailRequest = new EmailRequest( fromEmail, abuse, subject, `${intro}\n${times}\n${thanks}\n${logs}\n`);
            emailRequest.from.name = fromName;
            return JSON.stringify( emailRequest );
            // return emailRequest.toString(); //returns [object Object]
        } catch (e) {
            return e;
        }
    }
    //
    // use log data and load the template
    //
    private IncidentLogDetails( template: string ): string[] {
        let lines: string[] = [];
        if( this.debug > 0 ) {
            console.log( this.selectedLogs );
        }
        //
        this.selectedLogs.forEach( el => {
            const logTime: Date = el.NetworkLogDate;
            let timeZone: string = this.GetTimeZone( logTime );
            let log = el.Log.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            const locals = {
                NetworkLogId: el.NetworkLogId,
                IPAddress: el.IPAddress,
                NetworkLogDate: logTime,
                TimeZone: timeZone,
                Log: log,
                IncidentTypeShortDesc: el.IncidentTypeShortDesc
            }
            let line: string = this.Renderer( template, locals );
            if( this.debug > 0 ) {
                console.log( line );
            }
            lines.push( line );
        });
        return lines;
    }
    //
    // get the timezone for the incident date...
    // use company info to determine if daylight savings or not.
    //
    private GetTimeZone( logTime: Date ): string {
        let timeZone: string = '';
        if( this.networkIncident.user.Server.DST ) {
            if( logTime > this.networkIncident.user.Server.DST_Start && 
                    logTime < this.networkIncident.user.Server.DST_End ) {
                timeZone = this.networkIncident.user.Server.TimeZone_DST;
            } else {
                timeZone = this.networkIncident.user.Server.TimeZone;
            }
        } else {
            timeZone = this.networkIncident.user.Server.TimeZone;
        }
        return timeZone;
    }
    //
    // get the appropriate template...
    // if a single incident type then use it, else use 0/all template
    //
    private GetTemplate( ): IncidentType {
        // get a list of incident log types
        if( this.debug > 0 ) {
            console.log( this.incidTypes );
        }
        let tmpId: number = ( this.incidTypes.length > 1 ? 0 : this.incidTypes[0] );
        let templates: IncidentType[] =
            this.networkIncident.typeEmailTemplates.filter(
                el => el.IncidentTypeId === tmpId );
        if( templates.length > 0 ) {
            return templates[0];
        } else {
            return undefined;
        }
    }
    //
}
// ===========================================================================
