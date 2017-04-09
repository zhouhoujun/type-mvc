import { Context } from 'koa';
import { Injector } from './di';
/**
 * mvc Context.
 * @export
 * @interface MvcContext
 * @extends {Context}
 */
export interface MvcContext extends Context {
    /**
     * view render.
     * @param {string} viewName
     * @param {*} [model]
     *
     * @memberOf MvcContext
     */
    render?(viewName: string, model?: any);

    /**
     * injector service.
     */
    injector?: Injector;
}
