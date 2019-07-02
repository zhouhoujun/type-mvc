import { ObjectMap, InjectToken } from '@tsdi/ioc'
import { MvcContext } from './MvcContext';
import { IHandleContext } from '@tsdi/boot';
import { Context as KoaContext } from 'koa';

/**
 * mvc service middleware context.
 */
export const ContextToken = new InjectToken<IContext>('Mvc_Service_Context');


declare module 'koa' {
    interface Context {
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

    interface Request {
        /**
         * request body.
         *
         * @type {*}
         * @memberof Request
         */
        body?: any;
    }
}

/**
 * middleware context.
 * @export
 * @interface IContext
 * @extends {Context}
 */
export interface IContext extends KoaContext, ObjectMap, IHandleContext {

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

