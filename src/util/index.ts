export * from './type';
export * from './defer';
import * as _ from 'lodash';
const globby = require('globby');

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
 * fileFilter
 *
 * @export
 * @template T
 * @param {(string | string[])} express
 * @param {(fileName: string) => boolean} [filter]
 * @param {(filename: string) => string} [mapping]
 * @returns {Promise<T[]>}
 */
export function fileFilter<T>(express: string | string[], filter?: (fileName: string) => boolean, mapping?: (filename: string) => T): Promise<T[]> {
  return Promise.resolve(globby(express))
    .then((files: string[]) => {
      if (filter) {
        files = _.filter(files, filter)
      }
      if (mapping) {
        return _.map(files, mapping);
      } else {
        return files;
      }
    });
}
