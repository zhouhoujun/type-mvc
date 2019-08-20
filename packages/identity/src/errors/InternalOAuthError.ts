import { AuthenticationError } from './AuthenticationError';

/**
 * internal oauth error.
 *
 * @export
 * @class InternalOAuthError
 * @extends {AuthenticationError}
 */
export class InternalOAuthError extends AuthenticationError {
    constructor(message: string, public oauthError: Error) {
        super(400, message)
    }
}
