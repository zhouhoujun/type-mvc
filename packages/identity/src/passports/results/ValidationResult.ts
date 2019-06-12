import { Context } from 'koa';

/**
 * auth state.
 *
 * @export
 * @enum {number}
 */
export enum VaildateState {
    SUCCESS,
    FAIL,
    REDIRECT,
    PASS,
    ERROR
}

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
