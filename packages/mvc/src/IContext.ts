import { ObjectMap, InjectToken } from '@tsdi/ioc'
import { MvcContext } from './MvcContext';
import { IHandleContext } from '@tsdi/boot';
import { Context as KoaContext } from 'koa';

/**
 * mvc service middleware context.
 */
export const ContextToken = new InjectToken<IContext>('Mvc_Service_Context');
/**
 * middleware context.
 * @export
 * @interface IContext
 * @extends {Context}
 */
export interface IContext extends KoaContext, ObjectMap<any>, IHandleContext {

    /**
     * mvc context.
     *
     * @type {MvcContext}
     * @memberof IContext
     */
    mvcContext: MvcContext;

    /**
     * route prefix.
     *
     * @type {string}
     * @memberof IContext
     */
    routePrefix?: string;

}

