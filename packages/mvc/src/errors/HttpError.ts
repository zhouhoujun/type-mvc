
/**
 * http error
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class HttpError extends Error {

    constructor(public status: number, message?: string) {
        super();
        this.message = message;
        Error.captureStackTrace(this);
    }

    toString() {
        return `Http Error: ${this.status}, ${this.message}`;
    }

}
