export const Type = Function;

export function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}

/**
 * class type
 * 
 * @export
 * @interface Type
 * @extends {Function}
 * @template T 
 */
export interface Type<T> extends Function { new (...args: any[]): T; }

/**
 * object map
 * 
 * @export
 * @interface IMap
 * @template T 
 */
export interface IMap<T> {
    [K: string]: T;
}
