import { Registration, Token } from '@ts-ioc/core';
import { IContext } from '../IContext';
import { IApplication } from '../IApplication';
import { Next } from '../util';



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
    setup(app: IApplication);
}


/**
 * custom middleware.
 */
export type CustomMiddleware = (context: IContext, next: Next) => any | Function;

/**
 * middleware type.
 */
export type MiddlewareType = Token<IMiddleware> | CustomMiddleware;

/**
 *  middlewares with order.
 */
export interface OrderMiddleware {
    name?: string;
    middleware: Token<IMiddleware>;
}

/**
 *  default middleware name.
 */
export enum Middlewares {
    /**
     * context middleware token. to get context of one request.
     */
    Context = 'ContextMiddleware',
    /**
     * BodyParser middleware token.
     */
    BodyParser = 'BodyParserMiddleware',
    /**
     * Content middleware token.
     */
    Content = 'ContentMiddleware',
    /**
     * cors middleware token.
     */
    Cors = 'CorsMiddleware',
    /**
     * log middleware token.
     */
    Log = 'LogMiddleware',
    /**
     *
     */
    Json = 'JsonMiddleware',
    /**
     * session middleware token.
     */
    Session = 'SessionMiddleware',
    /**
     * views middleware token.
     */
    Views = 'ViewsMiddleware',
    /**
     * router middleware token.
     */
    Router = 'RouterMiddleware'
}


/**
 * default Middlewawre order.
 */
export const DefaultMiddlewawreOrder = [
    Middlewares.BodyParser,
    Middlewares.Json,
    Middlewares.Log,
    Middlewares.Session,
    Middlewares.Content,
    Middlewares.Context,
    Middlewares.Cors,
    Middlewares.Views,
    Middlewares.Router
];
