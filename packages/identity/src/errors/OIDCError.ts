import { HttpError } from '@mvx/mvc';
import { lang } from '@tsdi/ioc';

/**
 * error.
 *
 * @export
 * @class OIDCError
 * @extends {HttpError}
 */
export class OIDCError extends HttpError {
    error: string;
    expose: boolean;
    constructor(status: number, message: string) {
        super(status, message);
        this.name = lang.getClassName(this);
        this.error = message;
        this.expose = status < 500;
    }
}
