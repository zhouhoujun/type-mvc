import { Context } from 'koa';
import { ValidationResult } from './ValidationResult';
import { AuthenticateOption } from '../AuthenticateOption';

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
export class SuccessResult extends ValidationResult {

    constructor(private options: AuthenticateOption, private user: object, private info: { type: string, message: string }) {
        super();
    }

    async execute(ctx: Context, next: () => Promise<void>, callback?: Function): Promise<void> {
        let user = this.user;
        let info = this.info;
        let options = this.options;
        if (callback) {
            return callback(null, user, info);
        }

        if (options.successMessage) {
            if (!(info.type in ctx.session.message)) {
                ctx.session.message[info.type] = [];
            }
            ctx.session.message[info.type].push(info.message);
        }
        if (options.assignProperty) {
            ctx.state[options.assignProperty] = user;
            return next();
        }

        await ctx.login(user);
        if (options.authInfo !== false) {
            ctx.state.authInfo = await ctx.passport.transformAuthInfo(info, ctx);
        }
        if (options.successReturnToOrRedirect) {
            let url = options.successReturnToOrRedirect;
            if (ctx.session && ctx.session.returnTo) {
                url = ctx.session.returnTo;
                delete ctx.session.returnTo;
            }
            return ctx.redirect(url);
        }
        if (options.successRedirect) {
            return ctx.redirect(options.successRedirect);
        }
        return await next();
    }
}