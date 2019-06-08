export enum AuthState {
    SUCCESS,
    FAIL,
    REDIRECT,
    PASS,
    ERROR
}


export class AuthAction {
    constructor(public type: AuthState) {

    }
}

/**
 * Pass without making a success or fail decision.
 *
 * Under most circumstances, Strategies should not need to call this
 * function.  It exists primarily to allow previous authentication state
 * to be restored, for example from an HTTP session.
 *
 */
export class PassAction extends AuthAction {
    constructor() {
        super(AuthState.PASS);
    }
}

/**
 * Fail authentication, with optional `challenge` and `status`, defaulting
 * to 401.
 *
 * Strategies should return this action to fail an authentication attempt.
 *
 * @param {String} challenge
 * @param {Number} status
 * @api public
 */
export class FailAction extends AuthAction {
    constructor(public challenge: string, public status: number) {
        super(AuthState.FAIL);
    }
}

/**
 * Redirect to `url` with optional `status`, defaulting to 302.
 *
 * Strategies should return this function to redirect the user (via their
 * user agent) to a third-party website for authentication.
 *
 * @param {String} url
 * @param {Number} status
 * @api public
 */
export class RedirectAction extends AuthAction {
    constructor(public url: string, public status = 302) {
        super(AuthState.REDIRECT);
    }
}

/**
 * Authenticate `user`, with optional `info`.
 *
 * Strategies should return this action to successfully authenticate a
 * user.  `user` should be an object supplied by the application after it
 * has been given an opportunity to verify credentials.  `info` is an
 * optional argument containing additional user information.  This is
 * useful for third-party authentication strategies to pass profile
 * details.
 *
 * @param {Object} user
 * @param {Object} info
 * @api public
 */
export class SuccessAction extends AuthAction {
    constructor(public user: object, public info: { type: string, message: string }) {
        super(AuthState.SUCCESS);
    }
}
