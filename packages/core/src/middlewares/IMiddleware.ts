import { Registration, Token } from '@ts-ioc/core';
import { IContext } from '../IContext';



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
    setup?();
}


/**
 * custom middleware.
 */
export type CustomMiddleware = (context: IContext, next: Promise<any>) => any;

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
    Context = 'Context',
    /**
     * BodyParser middleware token.
     */
    BodyParser = 'BodyParser',
    /**
     * Content middleware token.
     */
    Content = 'Content',
    /**
     * cors middleware token.
     */
    Cors = 'Cors',
    /**
     * log middleware token.
     */
    Log = 'Log',
    /**
     *
     */
    Json = 'Json',
    /**
     * session middleware token.
     */
    Session = 'Session',
    /**
     * views middleware token.
     */
    Views = 'Views',
    /**
     * router middleware token.
     */
    Router = 'Router'
}

/**
 * Inject middleware token.
 *
 * @export
 * @class InjectMiddlewareToken
 * @extends {Registration<IMiddleware>}
 * @template T
 */
export class InjectMiddlewareToken extends Registration<IMiddleware> {
    constructor(desc: string) {
        super('MVX_Middleware', desc);
    }
}


export const DefaultMiddlewawres = [
    new InjectMiddlewareToken(Middlewares.BodyParser),
    new InjectMiddlewareToken(Middlewares.Json),
    new InjectMiddlewareToken(Middlewares.Log),
    new InjectMiddlewareToken(Middlewares.Session),
    new InjectMiddlewareToken(Middlewares.Content),
    new InjectMiddlewareToken(Middlewares.Context),
    new InjectMiddlewareToken(Middlewares.Cors),
    new InjectMiddlewareToken(Middlewares.Views)
];
