import { HttpError } from './HttpError';

export class NotFoundError extends HttpError {

    constructor(message = 'Not Found') {
        super(404, message);
    }
}
