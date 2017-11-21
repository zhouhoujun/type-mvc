export const Type = Function;
import { Middleware } from 'koa';
export function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}

/**
 * Middleware Factory
 * @export
 * @interface MiddlewareFactory
 */
export interface MiddlewareFactory {
  createMiddleware(): Middleware | Promise<Middleware>
}

export type AsyncMiddleware = Middleware | Promise<Middleware>;

export type MvcMiddleware = AsyncMiddleware | MiddlewareFactory;

/**
 * object map
 * @export
 * @interface IMap
 * @template T
 */
export interface IMap<T> {
  [K: string]: T;
}
