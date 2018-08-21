import { IMiddleware } from '@mvx/mvc';
import { Token } from '@ts-ioc/core';
import { IRoute } from './IRoute';

/**
 * router
 *
 * @export
 * @interface IRouter
 * @extends {IMiddleware}
 */
export interface IRouter extends IMiddleware {
    routes(map: IRoute);

    register(...controllers: Token<any>[]);

    getRoot(): IRoute;
}
