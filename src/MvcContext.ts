import { Context } from 'koa';
import { IContainer } from 'type-autofac'

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
     * IContainer.
     */
    container?: IContainer;
}
