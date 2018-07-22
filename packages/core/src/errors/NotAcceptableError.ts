import { HttpError } from './HttpError';

export class NotAcceptableError extends HttpError {

    constructor(message = 'Not Acceptable') {
        super(406, message);
    }
}
