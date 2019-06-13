import { AuthenticationError } from './AuthenticationError';

export class InvalidToken extends AuthenticationError {
    public error_detail: string;
    constructor(detail: string) {
        super(401, 'invalid_token', 'invalid token provided')
        this.error_detail = detail;
    }
}
