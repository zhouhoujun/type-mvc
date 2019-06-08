import { HttpError } from '@mvx/mvc';

/**
 * `AuthenticationError` error.
 *
 * @api private
 */
export class AuthenticationError extends HttpError {
    public static ErrorName = 'AuthenticationError';

    constructor(status: number, message) {
        super(status || 401, message);
        this.name = AuthenticationError.ErrorName;
        Error.captureStackTrace(this, this.constructor);
    }
}
