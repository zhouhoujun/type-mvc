import { IBaseTypeParser, BaseTypeParserToken } from './IBaseTypeParser';
import { Token, Singleton } from '@ts-ioc/core';

@Singleton(BaseTypeParserToken)
export class BaseTypeParser implements IBaseTypeParser {

    /**
     * parse param.
     *
     * @template T
     * @param {Token<T>} type
     * @param {*} paramVal
     * @returns {T}
     * @memberof BaseTypeParser
     */
    parse<T>(type: Token<T>, paramVal: any): T {
        let val;
        if (type === String) {
            val = String(paramVal);
        } else if (type === Boolean) {
            val = new Boolean(paramVal);
        } else if (type === Number) {
            val = parseFloat(paramVal);
        } else if (type === Date) {
            val = new Date(paramVal);
        } else {
            val = paramVal;
        }
        return val;
    }
}
