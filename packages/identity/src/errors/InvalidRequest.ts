import { HttpError } from '@mvx/mvc';

/**
 * invaild request error.
 *
 * @export
 * @class InvalidRequest
 * @extends {HttpError}
 */
export class InvalidRequest extends HttpError {
    constructor(msg = 'invaild scope') {
        super(400, msg)
    }
}
