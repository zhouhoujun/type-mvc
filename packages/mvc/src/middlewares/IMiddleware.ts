import { Token, PromiseUtil, Type } from '@tsdi/ioc';
import { IContext } from './IContext';
import { HandleType, Handle, IHandle } from '@tsdi/boot';
import { IConfiguration } from '../IConfiguration';
import { MvcContext } from '../MvcContext';



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
 * middleware type.
 */
export type MiddlewareType = Token<IMiddleware> | HandleType<IContext>;

/**
 * middleware factory.
 */
export type MvcMiddlewareType =  Type<Handle<IContext>> | Handle<IContext> | ((config?: IConfiguration, ctx?: MvcContext) => PromiseUtil.ActionHandle<IContext> | void);
