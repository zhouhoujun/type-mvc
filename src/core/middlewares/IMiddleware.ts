import { Middleware } from 'koa';
import * as Koa from 'koa';
import { IContainer } from '@ts-ioc/core';

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

