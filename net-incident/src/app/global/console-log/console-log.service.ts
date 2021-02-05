// ===========================================================================
// File: console-log.service.ts
import { Injectable } from '@angular/core';
//
import { environment } from '../../../environments/environment';
import { LogLevel } from './log-level.enum';
//
@Injectable({ providedIn: 'root' })
export class ConsoleLogService {
	//
	private _logLevel: LogLevel;
	get logLevel(): LogLevel {
		return this._logLevel;
	}
	set logLevel(newValue: LogLevel) {
		this._logLevel = newValue;
	}
	//
	constructor() {
		this._logLevel = environment.logLevel;
	}
	/*
	** Write an error (LogLevel) LogMessage to console.
	*/
	public Error(message: string ): string {
		return this.LogMessage(LogLevel.Error, message);
	}
	/*
	** Write a warning (LogLevel) LogMessage to console.
	*/
	public Warning(message: string): string {
		return this.LogMessage(LogLevel.Warning, message);
	}
	/*
	** Write a info (LogLevel) LogMessage to console.
	*/
	public Information(message: string): string {
		return this.LogMessage(LogLevel.Info, message);
	}
	/*
	** Write a debug (LogLevel) LogMessage to console.
	*/
	public Debug(message: string): string {
		return this.LogMessage(LogLevel.Debug, message);
	}
	/*
	** Write a verbose (LogLevel) LogMessage to console.
	*/
	public Verbose(message: string): string {
		return this.LogMessage(LogLevel.Verbose, message);
	}
	/*
	** do it in one place
	*/
	private LogMessage( logLevel: LogLevel, message: string): string {
		// 0=error, 1=warning, 2=info, 3=debug, 4=verbose
		if( logLevel <= this._logLevel ) {
			const _logString = this.getEnumKeyByEnumValue(LogLevel, logLevel);
			let msg: string = `${_logString}: ${message}`;
			switch(logLevel) {
				case LogLevel.Error:
					console.error( msg );
					break;
				case LogLevel.Warning:
					console.warn( msg );
					break;
				case LogLevel.Info:
				case LogLevel.Debug:
				case LogLevel.Verbose:
					// could use console warn/info/debug/trace
					console.log( msg );
					break;
				default:
					msg = `Unknown: ${message}`;
					console.error( msg );
					break;
			}
			return msg;
		} else {
			return '';
		}
	}
	/*
	** Convert the enum into a string value
	*/
	public getEnumKeyByEnumValue(myEnum: any, enumValue: any): string {
		const keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
		return keys.length > 0 ? keys[0] : '--';
	}
	//
}
// ===========================================================================
