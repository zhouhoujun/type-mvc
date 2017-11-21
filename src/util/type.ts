import { Middleware } from 'koa';

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
