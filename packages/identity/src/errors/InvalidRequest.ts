import { AuthenticationError } from './AuthenticationError';

/**
 * invaild request error.
 *
 * @export
 * @class InvalidRequest
 * @extends {HttpError}
 */
export class InvalidRequest extends AuthenticationError {
    constructor(description?: string, status = 400) {
        super(status, '', description || 'request is invalid')
    }
}
