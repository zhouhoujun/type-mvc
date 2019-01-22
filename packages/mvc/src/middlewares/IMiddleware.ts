import { Registration, Token } from '@ts-ioc/core';
import { IContext } from '../IContext';
import { IApplication } from '../IApplication';



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

/**
 * Middlewawre Tokens
 */
export const MiddlewareTokens = {
    BodyParser: new InjectMiddlewareToken(Middlewares.BodyParser),
    Json: new InjectMiddlewareToken(Middlewares.Json),
    Log: new InjectMiddlewareToken(Middlewares.Log),
    Session: new InjectMiddlewareToken(Middlewares.Session),
    Content: new InjectMiddlewareToken(Middlewares.Content),
    Context: new InjectMiddlewareToken(Middlewares.Context),
    Cors: new InjectMiddlewareToken(Middlewares.Cors),
    Views: new InjectMiddlewareToken(Middlewares.Views),
    Router: new InjectMiddlewareToken(Middlewares.Router)
}

/**
 * default Middlewawre chain.
 */
export const DefaultMiddlewawreChain = [
    MiddlewareTokens.BodyParser,
    MiddlewareTokens.Json,
    MiddlewareTokens.Log,
    MiddlewareTokens.Session,
    MiddlewareTokens.Content,
    MiddlewareTokens.Context,
    MiddlewareTokens.Cors,
    MiddlewareTokens.Views,
    MiddlewareTokens.Router
];
