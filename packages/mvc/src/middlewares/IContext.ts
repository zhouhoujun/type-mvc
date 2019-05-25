import { ObjectMap, InjectToken } from '@tsdi/ioc'
import { MvcContext } from '../MvcContext';
import { IHandleContext } from '@tsdi/boot';

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
export interface IContext extends ObjectMap<any>, IHandleContext {

    /**
     * mvc context.
     *
     * @type {MvcContext}
     * @memberof IContext
     */
    readonly mvcContext: MvcContext;

}

