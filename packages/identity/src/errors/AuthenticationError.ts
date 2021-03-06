import { lang } from '@tsdi/ioc';
import { HttpError } from '@mvx/mvc';

/**
 * error.
 *
 * @export
 * @class OIDCError
 * @extends {HttpError}
 */
export class AuthenticationError extends HttpError {
    error: string;
    expose: boolean;
    // tslint:disable-next-line: variable-name
    constructor(status: number, message: string|string[], public error_description?: string|string[]) {
        super(status, message);
        this.name = lang.getClassName(this);
        this.error = this.message;
        this.expose = status < 500;
    }
}
