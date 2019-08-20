import { AuthenticationError } from './AuthenticationError';


/**
 * invalid token.
 *
 * @export
 * @class InvalidToken
 * @extends {AuthenticationError}
 */
export class InvalidToken extends AuthenticationError {
    // tslint:disable-next-line:variable-name
    public error_detail: string;
    constructor(detail: string) {
        super(401, 'invalid_token', 'invalid token provided')
        this.error_detail = detail;
    }
}
