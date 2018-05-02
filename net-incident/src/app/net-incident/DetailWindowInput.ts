// ---------------------------------------------------------------------------
import { IUser, User } from './user';
import { IIncident, Incident } from './incident';
//
export class DetailWindowInput {
	// using short-hand declaration...
	constructor(
        public user: User,
		public incident: Incident,
	) {	}
}
// ---------------------------------------------------------------------------
