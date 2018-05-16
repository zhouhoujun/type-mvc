import { Middleware } from 'koa';
import * as Koa from 'koa';
import { IContainer, InjectToken } from '@ts-ioc/core';

/**
 * Middleware token.
 */
export const MiddlewareToken = new InjectToken<IMiddleware>('__MVC_IMiddleware');

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

