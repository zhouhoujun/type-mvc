import { Context } from 'koa';


/**
 * auth action
 *
 * @export
 * @class AuthAction
 */
export abstract class ValidationResult {

    constructor() {

    }

    abstract execute(ctx: Context, next: () => Promise<void>, callback?: Function): Promise<void>;
}
