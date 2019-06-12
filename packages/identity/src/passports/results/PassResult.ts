import { ValidationResult } from './ValidationResult';
import { Context } from 'koa';


/**
 * Pass without making a success or fail decision.
 *
 * Under most circumstances, Strategies should not need to call this
 * function.  It exists primarily to allow previous authentication state
 * to be restored, for example from an HTTP session.
 *
 */
export class PassResult extends ValidationResult {
    execute(ctx: Context, next: () => Promise<void>): Promise<void> {
        return next();
    }
}
