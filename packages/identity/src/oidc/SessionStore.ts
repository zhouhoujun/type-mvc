import { ISessionConfig } from '@mvx/mvc';
import { OIDCUtils } from './utils';
import { Context } from 'koa';


export class SessionStore {

    key: string;
    constructor(private options: ISessionConfig) {
        this.key = options.key
    }

    store(req, meta, callback) {
        if (!req.session) { return callback(new Error('OpenID Connect authentication requires session support when using state. Did you forget to use express-session middleware?')); }

        var key = this.key;
        var handle = OIDCUtils.uid(24);

        var state = { handle: handle };
        for (let entry in meta) {
            state[entry] = meta[entry];
        }

        if (!req.session[key]) { req.session[key] = {}; }
        req.session[key].state = state;

        callback(null, handle);
    }

    /**
     * Verify request state.
     *
     * This implementation simply compares the state parameter in the request to the
     * value generated earlier and stored in the session.
     *
     * @param {*} ctx
     * @param {*} providedState
     * @param {*} callback
     * @returns
     * @memberof SessionStore
     */
    verify(ctx: Context, providedState, callback) {
        if (!ctx.session) { return callback(new Error('OpenID Connect authentication requires session support when using state. Did you forget to use express-session middleware?')); }

        var key = this.key;
        if (!ctx.session[key]) {
            return callback(null, false, { message: 'Unable to verify authorization request state.' });
        }

        var state = ctx.session[key].state;
        if (!state) {
            return callback(null, false, { message: 'Unable to verify authorization request state.' });
        }

        delete ctx.session[key].state;
        if (Object.keys(ctx.session[key]).length === 0) {
            delete ctx.session[key];
        }

        if (state.handle !== providedState) {
            return callback(null, false, { message: 'Invalid authorization request state.' });
        }

        return callback(null, true, state);
    }
}