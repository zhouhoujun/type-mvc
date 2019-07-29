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
     * @param {() => Promise<void>} next
     * @param {Function} [callback]
     * @returns {Promise<void>}
     * @memberof ValidationResult
     */
    abstract execute(ctx: Context, next: () => Promise<void>, callback?: Function): Promise<void>;
}
