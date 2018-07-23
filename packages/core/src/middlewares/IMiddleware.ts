import { Registration, Token } from '@ts-ioc/core';



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
 *  middlewares with order.
 */
export type MiddlewareOrder = Token<IMiddleware>[];


/**
 * Inject middleware token.
 *
 * @export
 * @class InjectMiddlewareToken
 * @extends {Registration<T>}
 * @template T
 */
export class InjectMiddlewareToken<T extends IMiddleware> extends Registration<T> {
    constructor(desc: string) {
        super('MVX_Middleware', desc);
    }
}

/**
 * middleware token.
 */
export const MiddlewareToken = new InjectMiddlewareToken<IMiddleware>('');

/**
 * context middleware token.
 */
export const ContextMiddlewareToken = new InjectMiddlewareToken<IMiddleware>('Context');

/**
 * BodyParser middleware token.
 */
export const BodyParserMiddlewareToken = new InjectMiddlewareToken<IMiddleware>('BodyParser');


/**
 * Content middleware token.
 */
export const ContentMiddlewareToken = new InjectMiddlewareToken<IMiddleware>('Content');

/**
 * cors middleware token.
 */
export const CorsMiddlewareToken = new InjectMiddlewareToken<IMiddleware>('Cors');

/**
 * log middleware token.
 */
export const LogMiddlewareToken = new InjectMiddlewareToken<IMiddleware>('Log');

/**
 * Json middleware token.
 */
export const JsonMiddlewareToken = new InjectMiddlewareToken<IMiddleware>('Json');


/**
 * session middleware token.
 */
export const SessionMiddlewareToken = new InjectMiddlewareToken<IMiddleware>('Session');

/**
 * views middleware token.
 */
export const ViewsMiddlewareToken = new InjectMiddlewareToken<IMiddleware>('Views');

/**
 * router middleware token.
 */
export const RouterMiddlewareToken = new InjectMiddlewareToken<IMiddleware>('Router');
