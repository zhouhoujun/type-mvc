import { HttpError } from './HttpError';

export class ForbiddenError extends HttpError {
    constructor(message = 'Request Forbidden') {
        super(403, message);
    }
}
