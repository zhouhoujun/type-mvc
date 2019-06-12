import { OIDCError } from './OIDCError';

/**
 * `AuthenticationError` error.
 *
 * @api private
 */
export class AuthenticationError extends OIDCError {

    constructor(status: number, message = 'AuthenticationError') {
        super(status || 401, message);
    }
}
