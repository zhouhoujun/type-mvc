import { AuthenticationError } from './AuthenticationError';

/**
 * invaild request error.
 *
 * @export
 * @class InvalidRequest
 * @extends {HttpError}
 */
export class InvalidRequest extends AuthenticationError {
    constructor(message = 'invaild_scope') {
        super(400, message)
    }
}
