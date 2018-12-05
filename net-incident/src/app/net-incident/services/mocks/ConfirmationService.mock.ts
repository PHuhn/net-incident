//
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { Subject, Observable } from 'rxjs';
//
export class ConfirmationServiceMock { // extends ConfirmationService {
	//
	// key	string	null	Optional key to match the key of the confirm dialog, necessary to use when component tree has multiple confirm dialogs.
	// public key: string = 'mock1';
	// header	string	null	Header text of the dialog.
	// public header: string = 'Delete Confirmation';
	// icon	string	null	Icon to display next to the message.
	// public icon: string = '';
	// message	string	null	Message of the confirmation.
	public message: string = '';
	// Call Accept to emulate a user accepting
	public accept: Function;
	// Call Reject to emulate a user rejecting
	public reject: Function;
	//
	private requireConfirmationSource = new Subject<any>();
	requireConfirmation$ = this.requireConfirmationSource.asObservable();
	//
	public confirm(config: any) {
		console.log( 'In confirm service mock...' );
		this.message = config.message;
		this.accept = config.accept;
		this.reject = config.reject;
		console.log( this.message );
		return this;
	}
	//
}
//
// private requireConfirmationSource;
// private acceptConfirmationSource;
// requireConfirmation$: Observable<Confirmation>;
// accept: Observable<Confirmation>;
// confirm(confirmation: Confirmation): this;
// onAccept(): void;
