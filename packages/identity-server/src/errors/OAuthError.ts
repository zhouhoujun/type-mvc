import { HttpError } from '@mvx/mvc';

/**
 * `AuthenticationError` error.
 *
 * @api private
 */
export class AuthenticationError extends HttpError {

    constructor(status: number, message = 'AuthenticationError') {
        super(status || 401, message);
    }
}
