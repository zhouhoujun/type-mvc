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
 * class type
 * @export
 * @interface Type
 * @extends {Function}
 * @template T
 */
export interface Type<T> extends Function { new (...args: any[]): T; }

/**
 * factory tocken.
 */
export type Token<T> = Type<T> | InjectionToken<T> | string | symbol;

/**
 * injecto token.
 * @export
 * @class InjectionToken
 * @template T
 */
export class InjectionToken<T> {
  protected type: 'InjectionToken';
  constructor(protected Class: Type<T>, protected desc: string) {
  }

  getClass() {
    return this.Class
  }

  toString(): string {
    return `${this.type} ${typeof this.Class} ${this.desc}`;
  }
}

/**
 * object map
 * @export
 * @interface IMap
 * @template T
 */
export interface IMap<T> {
  [K: string]: T;
}

/**
 * request method.
 */
export enum RequestMethod {
  Get,
  Post,
  Put,
  Delete,
  Options,
  Head,
  Patch
}
