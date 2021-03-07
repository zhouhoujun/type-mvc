import { ObjectMap, tokenId } from '@tsdi/ioc';
import { IHandleContext } from '@tsdi/boot';
import { MvcContext } from './MvcContext';
import { Context } from 'koa';
import { ICoreInjector } from '@tsdi/core';

/**
 * mvc service middleware context.
 */
export const ContextToken = tokenId<IContext>('MVC_SERVICE_CONTEXT');


declare module 'koa' {
    interface Request {
        body?: any;
        rawBody: string;
    }
} 

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

