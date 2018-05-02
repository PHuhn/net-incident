// ===========================================================================
// File: select-item-class.ts
//  define the interface(IDropDown/class(DropDown)
//
import { SelectItem } from '../../../node_modules/primeng/components/common/selectitem';
//
export class SelectItemClass implements SelectItem
{
    public value: any;
    public label: string;
    public styleClass?: string;
    //
    // Create a dropdown object using 2 parameters constructor, default selected to false.
    //
	constructor( value: any, label: string ) {
        this.value = value;
        this.label = label;
    }
    //
    // Create a 'to string'.
    //
    toString( ): string {
       return `SelectItem:[Value: ${this.value}, Text: ${this.label}, styleClass: ${this.styleClass}]`;
    }
    //
}
// ===========================================================================
