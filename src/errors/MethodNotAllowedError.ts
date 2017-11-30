import { HttpError } from './HttpError';

export class MethodNotAllowedError extends HttpError {

    constructor(message = 'Method Not Allowed') {
        super(405, message);
    }
}
