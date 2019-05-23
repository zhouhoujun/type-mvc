import { ObjectMap } from '@tsdi/ioc'
import { MvcContext } from './MvcContext';
import { IHandleContext } from '@tsdi/boot';

/**
 * middleware context.
 * @export
 * @interface IContext
 * @extends {Context}
 */
export interface IContext extends ObjectMap<any>, IHandleContext {

    /**
     * mvc context.
     *
     * @type {MvcContext}
     * @memberof IContext
     */
    readonly mvcContext: MvcContext;

}

