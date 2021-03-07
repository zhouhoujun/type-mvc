import { isArray } from '@tsdi/ioc';

/**
 * http error
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class HttpError extends Error {
    constructor(public status: number, message?: string |string[]) {
        super();
        this.message = isArray(message)? message.join('\n') : message;
        Error.captureStackTrace(this);
    }

    toString() {
        return `Http Error: ${this.status}, ${this.message}`;
    }

}
