import { Context } from 'koa'
import { IContainer, ObjectMap } from 'tsioc'

/**
 * mvc IContext.
 * @export
 * @interface IContext
 * @extends {Context}
 */
export interface IContext extends Context, ObjectMap<any> {

}

