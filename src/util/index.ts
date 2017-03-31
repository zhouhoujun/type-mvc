export function stringify(token: any): string {
  if (typeof token === 'string') {
    return token;
  }

  if (token == null) {
    return '' + token;
  }

  if (token.overriddenName) {
    return `${token.overriddenName}`;
  }

  if (token.name) {
    return `${token.name}`;
  }

  const res = token.toString();
  const newLineIndex = res.indexOf('\n');
  return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}

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
