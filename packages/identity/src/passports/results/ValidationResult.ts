import { Context } from 'koa';
import '../IAuthenticator';

/**
 * auth action
 *
 * @export
 * @class AuthAction
 */
export abstract class ValidationResult {

    constructor() {

    }

    /**
     * execute result.
     *
     * @abstract
     * @param {Context} ctx
     * @param {Function} [callback]
     * @returns {any}
     * @memberof ValidationResult
     */
    abstract action(ctx: Context, callback?: Function): any;
}
