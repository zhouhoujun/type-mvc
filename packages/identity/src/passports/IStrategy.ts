import { Context } from 'koa';
import { ValidationResult } from './results';

/**
 * authenticate strategy.
 *
 * @export
 * @interface IStrategy
 */
export interface IStrategy {
    /**
     * name of strategy
     *
     * @type {string}
     * @memberof IStrategy
     */
    name: string;
    /**
     * Authenticate request based on the current session state.
     *
     * The session authentication strategy uses the session to restore any login
     * state across requests.  If a login session has been established, `req.user`
     * will be populated with the current user.
     *
     * This strategy is registered automatically by Passport.
     *
     * @param {Context} ctx
     * @param {*} [options]
     * @returns {Promise<ValidationResult>}
     * @memberof IStrategy
     */
    authenticate(ctx: Context, options?: any): Promise<ValidationResult>;
}
