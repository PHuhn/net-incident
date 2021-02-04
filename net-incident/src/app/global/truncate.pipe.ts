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
	// {{ val | truncate:25 }}
	// or
	// {{ val | truncate: 22: '...' }}
	//
	transform(value: string, len: number, args?: string): string {
		len = len < 1 ? 30 : len;
		const ellipsis = args === undefined ? '' : args;
		return value.length > len ? value.substring( 0, len ) + ellipsis : value;
	}
	//
}
// ===========================================================================
