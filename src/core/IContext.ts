import { Context } from 'koa'
import { IContainer, ObjectMap, InjectToken } from '@ts-ioc/core'

/**
 * context token.
 */
export const ContextToken = new InjectToken<IContext>('__MVC_IContext');

/**
 * mvc IContext.
 * @export
 * @interface IContext
 * @extends {Context}
 */
export interface IContext extends Context, ObjectMap<any> {

}

