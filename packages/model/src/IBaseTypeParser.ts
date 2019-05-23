import { Type, Token, InjectToken } from '@tsdi/core';
/**
 * base type parser.
 *
 * @export
 * @interface IBaseTypeParser
 */
export interface IBaseTypeParser {
    /**
     * parse val.
     *
     * @param {Token<T>} type
     * @param {*} paramVal
     * @returns {T}
     * @memberof IBaseTypeParser
     */
    parse<T>(type: Token<T>, paramVal): T;
}

export const BaseTypeParserToken = new InjectToken<IBaseTypeParser>('BaseTypeParser');
