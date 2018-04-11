import { Context } from 'koa'
import { IContainer, ObjectMap } from '@ts-ioc/core'

/**
 * mvc IContext.
 * @export
 * @interface IContext
 * @extends {Context}
 */
export interface IContext extends Context, ObjectMap<any> {

}

