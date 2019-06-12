import { OIDCError } from './OIDCError';


/**
 * invaild request error.
 *
 * @export
 * @class InvalidRequest
 * @extends {HttpError}
 */
export class InvalidRequest extends OIDCError {
    constructor(msg = 'invaild scope') {
        super(400, msg)
    }
}
