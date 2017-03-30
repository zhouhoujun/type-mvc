import { Context } from 'koa';

/**
 * mvc Context.
 * 
 * @export
 * @interface MvcContext
 * @extends {Context}
 */
export interface MvcContext extends Context {
    /**
     * view render.
     * 
     * @param {string} viewName 
     * @param {*} [model] 
     * 
     * @memberOf MvcContext
     */
    render?(viewName: string, model?: any);

    /**
     * application root.
     * 
     * @type {string}
     * @memberOf MvcContext
     */
    appRoot: string;

}
