import { HttpError } from './HttpError';

export class BadRequestError extends HttpError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}
