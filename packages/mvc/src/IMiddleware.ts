import { Token } from '@tsdi/ioc';
import { IContext } from './IContext';
// import { IHandle } from '@tsdi/boot';



/**
 * Middleware inteface
 * @export
 * @interface IMiddleware
 */
export interface IMiddleware { // extends IHandle {
    /**
        * execute handle.
        *
        * @param {T} ctx
        * @param {() => Promise<void>} next
        * @returns {Promise<void>}
        * @memberof IHandle
        */
    execute(ctx: IContext, next: () => Promise<void>): Promise<void>
}


/**
 * custom middleware.
 */
export type CustomMiddleware = (context: IContext,  next: () => Promise<void>) => any | Function;

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
