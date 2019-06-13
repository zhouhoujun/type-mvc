import { AuthenticationError } from './AuthenticationError';

export class InternalOAuthError extends AuthenticationError {
    constructor(message: string, public oauthError: Error) {
        super(400, message)
    }
}
