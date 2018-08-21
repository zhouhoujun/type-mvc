import { GComponent, IContainer } from '@ts-ioc/core';
import { IContext, Next } from '@mvx/mvc';


export interface RouteAction {
    (ctx: IContext, next: Next): Promise<any>;
}

/**
 * route interface.
 *
 * @export
 * @interface IRoute
 * @extends {GComponent<IRoute>}
 */
export interface IRoute extends GComponent<IRoute> {
    /**
     * route url.
     *
     * @type {string}
     * @memberof IRoute
     */
    url: string;
    /**
     * check the request url is match the route or not.
     *
     * @param {(IContext | string)} ctx
     * @returns {IRoute}
     * @memberof IRoute
     */
    match(ctx: IContext | string): IRoute;
    /**
     * options request response.
     *
     * @param {IContainer} container
     * @param {IContext} ctx
     * @param {Next} next
     * @returns {Promise<any>}
     * @memberof IRoute
     */
    options(container: IContainer, ctx: IContext, next: Next): Promise<any>;
    /**
     * navigating to the matched route.
     *
     * @param {IContainer} container
     * @param {IContext} ctx
     * @param {Next} next
     * @returns {Promise<any>}
     * @memberof IRoute
     */
    navigating(container: IContainer, ctx: IContext, next: Next): Promise<any>;
}
