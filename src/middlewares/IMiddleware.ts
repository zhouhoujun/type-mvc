import { Middleware } from 'koa';
import * as Koa from 'koa';
import { IContainer } from 'type-autofac';

/**
 * Middleware inteface
 * @export
 * @interface IMiddleware
 */
export interface IMiddleware {
    /**
     * setup middleware.
     *
     * @memberof IMiddleware
     */
    setup();
}

