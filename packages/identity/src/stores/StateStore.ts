import { Context } from 'koa';

/**
 * store metadata.
 *
 * @export
 * @interface StoreMeta
 */
export interface StoreMeta {
    timestamp?: number;
    params?: any;
    grant_type?: string;

    identifierField?: string;
    scope?: string | string[];
    issuer?: any;
    authorizationURL?: string;
    tokenURL?: string;
    clientID?: string;
    clientSecret?: string;
    callbackURL?: string;
    customHeaders?: any;
    skipUserProfile?: boolean;
    userInfoURL?: string;
}

export interface VerifyResult {
    state?: StoreMeta;
    /**
     * verify result.
     *
     * @type {boolean}
     * @memberof VerifyResult
     */
    result: boolean;
    /**
     * message.
     *
     * @type {string}
     * @memberof VerifyResult
     */
    message: string;
}

/**
 * state store.
 *
 * @export
 * @interface IStateStore
 */
export interface IStateStore {
    /**
     * Store request state.
     *
     * This implementation simply generates a random string and stores the value in
     * the session, where it will be used for verification when the user is
     * redirected back to the application.
     *
     * @param {Context} ctx
     * @param {StoreMeta} [meta]
     * @returns {Promise<string>}
     * @memberof IStateStore
     */
    store(ctx: Context, meta?: StoreMeta): Promise<string>;
    /**
     * Verify request state.
     *
     * This implementation simply compares the state parameter in the request to the
     * value generated earlier and stored in the session.
     *
     * @param {Context} ctx
     * @param {string} providedState
     * @returns {Promise<VerifyResult>}
     * @memberof IStateStore
     */
    verify(ctx: Context, providedState: string): Promise<VerifyResult>;
}

export abstract class StateStore implements IStateStore {

    constructor() {

    }

    abstract store(ctx: Context, meta?: StoreMeta): Promise<string>;
    abstract verify(ctx: Context, providedState: string): Promise<VerifyResult>;
}
