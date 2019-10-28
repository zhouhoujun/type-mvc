import { ObjectMap, InjectToken } from '@tsdi/ioc';
import { IHandleContext } from '@tsdi/boot';
import { MvcContext } from './MvcContext';
import { Context } from 'koa';
import 'koa-bodyparser';

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
export interface IContext extends Context, ObjectMap, IHandleContext {

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

