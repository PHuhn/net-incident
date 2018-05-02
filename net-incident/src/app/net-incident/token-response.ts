// ===========================================================================
// File: token-response.ts
//
export interface ITokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    userName: string;
    ".expires": string;
    ".issued": string;
}
//
export class TokenResponse implements ITokenResponse {
	//
    public ".expires": string;
    public ".issued": string;
    // using short-hand declaration...
	constructor(
        public access_token: string,
        public token_type: string,
        public expires_in: number,
        public userName: string
	) { }
	//
}
//
// ===========================================================================
