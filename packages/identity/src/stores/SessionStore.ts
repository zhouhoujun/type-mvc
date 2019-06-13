import { StateStore, StoreMeta, VerifyResult } from './StateStore';
import { Context } from 'koa';
import { OIDCUtils } from './utils';

/**
 * Creates an instance of `SessionStore`.
 *
 * This is the state store implementation for the OAuth2Strategy used when
 * the `state` option is enabled.  It generates a random state and stores it in
 * `req.session` and verifies it when the service provider redirects the user
 * back to the application.
 *
 * This state store requires session support.  If no session exists, an error
 * will be thrown.
 *
 */
export class SessionStore extends StateStore {

    constructor(private key: string) {
        super();
    }

    /**
     * Store request state.
     *
     * This implementation simply generates a random string and stores the value in
     * the session, where it will be used for verification when the user is
     * redirected back to the application.
     *
     */
    public async store(ctx: Context, meta?: StoreMeta): Promise<string> {
        if (!ctx.session) {
            throw new Error(`OAuth 2.0 authentication requires session support
             when using state. Did you forget to use session middleware?`);
        }

        const key = this.key;
        const state = OIDCUtils.uid(24);
        if (!ctx.session[key]) {
            ctx.session[key] = {};
        }
        ctx.session[key].state = state;
        return state;
    }

    /**
     * Verify request state.
     *
     * This implementation simply compares the state parameter in the request to the
     * value generated earlier and stored in the session.
     *
     */
    public async verify(ctx: Context, providedState: string): Promise<VerifyResult> {
        if (!ctx.session) {
            throw new Error(`OAuth 2.0 authentication requires session support
            when using state. Did you forget to use express-session middleware?`);
        }

        const key = this.key;
        if (!ctx.session[key]) {
            return {
                result: false,
                message: 'Unable to verify authorization request state.',
            };
        }

        const state = ctx.session[key].state;
        if (!state) {
            return {
                result: false,
                message: 'Unable to verify authorization request state.',
            };
        }

        delete ctx.session[key].state;
        if (Object.keys(ctx.session[key]).length === 0) {
            delete ctx.session[key];
        }

        if (state !== providedState) {
            return {
                result: false,
                message: 'Invalid authorization request state.',
            };
        }

        return { result: true, state: state, message: '' };
    }
}
