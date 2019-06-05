import { HttpError } from '@mvx/mvc';

export class OAuthError extends HttpError {
    constructor(message = 'OAuthError') {
        super(401, message);
    }

    toString() {
        return `Http Error: ${this.code}, ${this.message}`;
    }
}
