import { HttpError } from './HttpError';

export class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}
