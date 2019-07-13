import { MvcMiddleware } from './MvcMiddleware';
import { MvcMiddlewares } from './MvcMiddlewares';
import { isMiddlewareFunc } from './IMiddleware';

export * from './IMiddleware';
export * from './MvcMiddleware';
export * from './MvcMiddlewares';
export * from './MiddlewareRegister';

/**
 * is mvc middleware or not.
 *
 * @export
 * @param {*} target
 * @returns {boolean}
 */
export function isMvcMiddleware(target: any): boolean {
    return isMiddlewareFunc(target) || target instanceof MvcMiddleware || target instanceof MvcMiddlewares;
}
