/**
 * promise defer.
 *
 * @export
 * @interface Defer
 * @template T
 */
export interface Defer<T> {
  promise: Promise<T>;
  resolve: (value?: T | PromiseLike<T>) => void;
  reject: (reason?) => void;
}


/**
 * create promise defer.
 *
 * @export
 * @template T
 * @param {(((value: T) => T | PromiseLike<T>))} [then]
 * @returns {Defer<T>}
 */
export function createDefer<T>(then?: ((value: T) => T | PromiseLike<T>)): Defer<T> {
  let defer = {} as Defer<T>;
  defer.promise = new Promise<T>((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  if (then) {
    defer.promise = defer.promise.then(then);
  }
  return defer;
}
