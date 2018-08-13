import { IContext } from '@mvx/core';
import { Context } from 'koa';

/**
 * koa context.
 *
 * @export
 * @interface KoaContext
 * @extends {Context}
 * @extends {IContext}
 */
export interface KoaContext extends Context, IContext {

}
