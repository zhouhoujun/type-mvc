import { AuthenticationError } from './AuthenticationError';

/**
 * error.
 *
 * @export
 * @class OIDCError
 * @extends {HttpError}
 */
export class OIDCError extends AuthenticationError {

    constructor(message: string, public code: string, public uri?: string, status?: number) {
        super(status, message);
        if (!status) {
            switch (code) {
                case 'access_denied': status = 403; break;
                case 'server_error': status = 502; break;
                case 'temporarily_unavailable': status = 503; break;
            }
        }
        this.expose = status < 500;
    }
}
