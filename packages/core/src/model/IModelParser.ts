import { Type, SymbolType, Registration } from '@ts-ioc/core';

/**
 * model parser. parser model from request.
 *
 * @export
 * @interface IModelParser
 */
export interface IModelParser {
    /**
     * type is model or not.
     *
     * @param {Type<any>} type
     * @returns {boolean}
     * @memberof IModelParser
     */
    isModel(type: Type<any>): boolean;

    /**
     * parse model.
     *
     * @param {Type<any>} type
     * @param {any} objMap
     * @returns {*}
     * @memberof IModelParser
     */
    parseModel(type: Type<any>, objMap: any): any;


    /**
     * is base type.
     *
     * @param {*} type
     * @returns {boolean}
     * @memberof IModelParser
     */
    isBaseType(type: any): boolean;

    /**
     * parse base type.
     *
     * @param {*} type
     * @param {*} paramVal
     * @returns {*}
     * @memberof IModelParser
     */
    parseBaseType(type, paramVal): any;
}

/**
 * inject model parser token.
 *
 * @export
 * @class InjectModelParserToken
 * @extends {Registration<T>}
 * @template T
 */
export class InjectModelParserToken<T extends IModelParser> extends Registration<T> {
    constructor(desc: string) {
        super('modelParser', desc);
    }
}

/**
 * module parser token.
 */
export const ModelParserToken = new InjectModelParserToken<IModelParser>('')
