import { HttpError } from '@mvx/mvc';

export class NoOpenIDError extends HttpError {
    constructor(message, public response) {
        super(400, message);
    }
}
