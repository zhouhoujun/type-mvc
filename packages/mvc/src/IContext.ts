import { ObjectMap, InjectToken, tokenId } from '@tsdi/ioc';
import { IHandleContext } from '@tsdi/boot';
import { MvcContext } from './MvcContext';
import { Context } from 'koa';
import 'koa-bodyparser';
import { ICoreInjector } from '@tsdi/core';

/**
 * mvc service middleware context.
 */
export const ContextToken = tokenId<IContext>('MVC_SERVICE_CONTEXT');


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

    getInjector(): ICoreInjector;

    /**
     * route prefix.
     *
     * @type {string}
     * @memberof IContext
     */
    routePrefix?: string;

}

