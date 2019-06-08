/**
 * `AuthorizationError` error.
 *
 * AuthorizationError represents an error in response to an authorization
 * request.  For details, refer to RFC 6749, section 4.1.2.1.
 *
 * References:
 *   - [The OAuth 2.0 Authorization Framework](http://tools.ietf.org/html/rfc6749)
 *
 */
export class AuthorizationError extends Error {
    public static ErrorName: string = 'AuthorizationError';

    constructor(message: string,
                public uri: string,
                public code: string = 'server_error',
                public status?: number) {
        super(message);
        this.name = AuthorizationError.ErrorName;
        if (!status) {
            switch (code) {
                case 'access_denied': this.status = 403; break;
                case 'server_error': this.status = 502; break;
                case 'temporarily_unavailable': this.status = 503; break;
                default: this.status = 500;
            }
        }
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * `TokenError` error.
 *
 * TokenError represents an error received from a token endpoint.  For details,
 * refer to RFC 6749, section 5.2.
 *
 * References:
 *   - [The OAuth 2.0 Authorization Framework](http://tools.ietf.org/html/rfc6749)
 *
 * @api public
 */
export class TokenError extends Error {
    public static ErrorName: string = 'OAuth2TokenError';

    constructor(message: string,
                public uri: string,
                public code: string = 'invalid_requret',
                public status: number = 500) {
        super(message);
        this.name = TokenError.ErrorName;
        Error.captureStackTrace(this, this.constructor);
    }
}
