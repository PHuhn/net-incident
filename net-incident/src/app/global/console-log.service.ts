// ===========================================================================
import { Injectable } from '@angular/core';
//
import { environment } from '../../environments/environment';
import { LogLevel } from './log-level.enum';
//
@Injectable({ providedIn: 'root' })
export class ConsoleLogService {
	//
	private _logLevel: LogLevel;
	get logLevel(): LogLevel {
		return this._logLevel;
	}
	set logLevel(newName: LogLevel) {
		this._logLevel = newName;
	}
	//
	constructor() {
		//	this._logLevel = logLevel;
		this._logLevel = environment.logLevel;
	}
	//
	// Write a error (LogLevel) LogMessage to console.
	public Error(message: string ): number {
		return this.LogMessage(LogLevel.Error, message);
	}
	//
	// Write a warning (LogLevel) LogMessage to console.
	public Warning(message: string): number {
		return this.LogMessage(LogLevel.Warning, message);
	}
	//
	// Write a info (LogLevel) LogMessage to console.
	public Information(message: string): number {
		return this.LogMessage(LogLevel.Info, message);
	}
	//
	// Write a debug (LogLevel) LogMessage to console.
	public Debug(message: string): number {
		return this.LogMessage(LogLevel.Debug, message);
	}
	// Write a verbose (LogLevel) LogMessage to console.
	public Verbose(message: string): number {
		return this.LogMessage(LogLevel.Verbose, message);
	}
	//
	// do it in one place
	private LogMessage( logLevel: LogLevel, message: string): number {
		// 0=error, 1=warning, 2=info, 3=debug, 4=verbose
		if( logLevel <= this._logLevel ) {
			const _logString = this.getEnumKeyByEnumValue(LogLevel, logLevel);
			switch(logLevel) {
				case LogLevel.Error:
					console.error( `${_logString}: ${message}` );
					break;
				case LogLevel.Warning:
					console.warn( `${_logString}: ${message}` );
					break;
				case LogLevel.Info:
				case LogLevel.Debug:
				case LogLevel.Verbose:
					// could use console warn/info/debug/trace
					console.log( `${_logString}: ${message}` );
					break;
				default:
					console.log( `Unknown: ${message}` );
					break;
			}
			return 1;
		} else {
			return 0;
		}
	}
	//
	public getEnumKeyByEnumValue(myEnum, enumValue): string {
		const keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
		return keys.length > 0 ? keys[0] : null;
	}
	//
}
// ===========================================================================
