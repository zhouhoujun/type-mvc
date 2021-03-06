import { ValidationResult } from './ValidationResult';
import { Context } from 'koa';


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
export class RedirectResult extends ValidationResult {

    constructor(public url: string, public status = 302) {
        super();
    }

    /**
     * execute.
     *
     * @param {Context} ctx
     * @returns {Promise<void>}
     * @memberof RedirectResult
     */
    action(ctx: Context): void {
        ctx.status = this.status;
        ctx.redirect(this.url);
    }

}
