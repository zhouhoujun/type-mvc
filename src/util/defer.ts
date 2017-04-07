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
 * @returns {Defer<T>}
 */
export function createDefer<T>(): Defer<T> {
  let defer = {} as Defer<T>;
  defer.promise = new Promise<T>((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
}
