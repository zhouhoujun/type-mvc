import { Context } from 'koa'
import { IContainer, ObjectMap } from 'type-autofac'

/**
 * mvc Context.
 * @export
 * @interface MvcContext
 * @extends {Context}
 */
export interface MvcContext extends Context, ObjectMap<any> {

}
