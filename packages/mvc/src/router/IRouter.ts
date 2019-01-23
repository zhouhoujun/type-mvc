import { Token } from '@ts-ioc/core';
import { IRoute } from './IRoute';

/**
 * router
 *
 * @export
 * @interface IRouter
 * @extends {IMiddleware}
 */
export interface IRouter {
    /**
     * setting routes map.
     *
     * @param {IRoute} map
     * @memberof IRouter
     */
    routes(map: IRoute);

    /**
     * register controllers.
     *
     * @param {...Token<any>[]} controllers
     * @memberof IRouter
     */
    register(...controllers: Token<any>[]);

    /**
     * get root.
     *
     * @returns {IRoute}
     * @memberof IRouter
     */
    getRoot(): IRoute;

    /**
     * set root route.
     *
     * @param {string} [routePrefix]
     * @memberof IRouter
     */
    setRoot(routePrefix?: string): void;
}


