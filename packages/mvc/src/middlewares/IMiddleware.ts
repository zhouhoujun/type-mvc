import { Token, PromiseUtil, Type, isFunction, isString } from '@tsdi/ioc';
import { IContext } from '../IContext';
import { HandleType, IHandle } from '@tsdi/boot';
import { IConfiguration } from '../IConfiguration';
import { MvcContext } from '../MvcContext';


/**
 * middleware func.
 *
 * @export
 * @interface MiddlewareFunc
 * @extends {Function}
 * @template T
 */
export interface MiddlewareFunc extends PromiseUtil.ActionHandle<IContext> {
    /**
     * middleware name.
     *
     * @type {string}
     * @memberof MiddlewareFunc
     */
    middleName?: string;
}

/**
 * middlware check.
 *
 * @export
 * @template T
 * @param {*} target
 * @returns {target is MiddlewareFunc}
 */
export function isMiddlewareFunc(target: any): target is MiddlewareFunc {
    return isFunction(target) && isString(target.middleName);
}

/**
 * bind middleware name.
 *
 * @export
 * @param {Function} middleware
 * @param {string} name
 * @returns {MiddlewareFunc}
 */
export function bindMiddlewareName(middleware: Function, name: string): MiddlewareFunc {
    let middle = middleware as MiddlewareFunc;
    middle.middleName = name;
    return middle;
}

/**
 * Middleware inteface
 * @export
 * @interface IMiddleware
 */
export interface IMiddleware extends IHandle<IContext> {
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
 * middleware class.
 *
 * @export
 * @interface MiddlewareClass
 * @extends {Type<T>}
 * @template T
 */
export interface MiddlewareClass<T extends IMiddleware> extends Type<T>, MiddlewareFunc {

}


/**
 * default middleware types.
 *
 * @export
 * @enum {number}
 */
export enum MiddlewareTypes {
    Helmet = 'helmet',
    BodyParser = 'bodyParser',
    Json = 'json',
    Logger = 'logger',
    Session = 'session',
    Content = 'content',
    View = 'view',
    Router = 'router'
}

/**
 * middleware type.
 */
export type MiddlewareType = Token<IMiddleware> | HandleType<IContext> | MiddlewareFunc;

/**
 * middleware factory.
 */
export type MvcMiddlewareType = Type<IMiddleware> | IMiddleware | ((config?: IConfiguration, ctx?: MvcContext) => MiddlewareFunc | PromiseUtil.ActionHandle<IContext> | void);
