import { Token } from '@tsdi/ioc';
import { IContext } from './IContext';
import { HandleType } from '@tsdi/boot';
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
 * middleware type.
 */
export type MiddlewareType = Token<IMiddleware> | HandleType<IContext>;

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
export enum MiddlewareTypes {
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
    MiddlewareTypes.BodyParser,
    MiddlewareTypes.Json,
    MiddlewareTypes.Log,
    MiddlewareTypes.Session,
    MiddlewareTypes.Content,
    MiddlewareTypes.Context,
    MiddlewareTypes.Cors,
    MiddlewareTypes.Views,
    MiddlewareTypes.Router
];
