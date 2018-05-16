import { Middleware } from 'koa';
import * as Koa from 'koa';
import { IContainer, InjectToken } from '@ts-ioc/core';

/**
 * middleware token.
 */
export const MiddlewareToken = new InjectToken<IMiddleware>('__MVC_Middleware');

/**
 * context middleware token.
 */
export const ContextMiddlewareToken = new InjectToken<IMiddleware>('__MVC_Middleware_Context');

/**
 * BodyParser middleware token.
 */
export const BodyParserMiddlewareToken = new InjectToken<IMiddleware>('__MVC_Middleware_BodyParser');


/**
 * Content middleware token.
 */
export const ContentMiddlewareToken = new InjectToken<IMiddleware>('__MVC_Middleware_Content');

/**
 * cors middleware token.
 */
export const CorsMiddlewareToken = new InjectToken<IMiddleware>('__MVC_Middleware_Cors');

/**
 * log middleware token.
 */
export const LogMiddlewareToken = new InjectToken<IMiddleware>('__MVC_Middleware_Log');

/**
 * Json middleware token.
 */
export const JsonMiddlewareToken = new InjectToken<IMiddleware>('__MVC_Middleware_Json');


/**
 * session middleware token.
 */
export const SessionMiddlewareToken = new InjectToken<IMiddleware>('__MVC_Middleware_Session');

/**
 * views middleware token.
 */
export const ViewsMiddlewareToken = new InjectToken<IMiddleware>('__MVC_Middleware_Views');


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

