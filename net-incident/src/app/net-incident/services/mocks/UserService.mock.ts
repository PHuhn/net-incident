// ===========================================================================
// File: UserService.mock.ts
//
import { Observable } from 'rxjs/Rx';
//
import { UserService } from '../../../net-incident/services/user.service';
import { IUser, User } from '../../../net-incident/user';
//
export class UserServiceMock extends UserService {
	//
	public mockUser: User = undefined;
	public mockUserServer: User = undefined;
	//
	// Service constructor
	//
	constructor( ) {
		super(null);
		this.codeName = 'User-Service-Mock';
	}
	//
	// CRUD (Create/Read/Update/Delete)
	// Get User with UserAccount
	//
	getUser( UserAccount: string ): Observable<IUser> {
		const urlPath: string = this.url + '/' + String( UserAccount );
		return Observable.of( this.mockUser );
	}
	//
	// Get User with UserAccount
	//
	getUserServer( userName: string, serverShortName: string ): Observable<IUser> {
		const urlPath: string = this.url + '?id=' + userName
			+ '&serverShortName=' + serverShortName;
		return Observable.of( this.mockUserServer );
	}
	//
}
// ===========================================================================
