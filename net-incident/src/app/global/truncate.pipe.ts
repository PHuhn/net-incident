// ===========================================================================
// File: truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
//
@Pipe({
	name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
	//
	// Examples:
	// {{ val | truncate:[25] }}
	// or
	// {{ val | truncate:[22, '...'] }}
	//
	transform(value: string, args: string[]): string {
		const len = args.length > 0 ? parseInt( args[0], 10 ) : 30;
		const ellipsis = args.length > 1 ? args[1] : '';
		return value.length > len ? value.substring( 0, len ) + ellipsis : value;
	}
	//
}
// ===========================================================================
