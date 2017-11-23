import { Context } from 'koa'
import { IContainer, ObjectMap } from 'type-autofac'

/**
 * mvc IContext.
 * @export
 * @interface IContext
 * @extends {Context}
 */
export interface IContext extends Context, ObjectMap<any> {

}

