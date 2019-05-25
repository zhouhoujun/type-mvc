import { Type, Registration } from '@tsdi/ioc';

/**
 * model parser. parser model from request.
 *
 * @export
 * @interface IModelParser
 */
export interface IModelParser<T> {

    /**
     * parse model.
     *
     * @param {Type<T>} type
     * @param {T} objMap
     * @returns {*}
     * @memberof IModelParser
     */
    parseModel(type: Type<T>, objMap: any): T;

}

/**
 * inject model parser token.
 *
 * @export
 * @class InjectModelParserToken
 * @extends {Registration<T>}
 * @template T
 */
export class InjectModelParserToken<T> extends Registration<IModelParser<T>> {
    constructor(type: Type<T>) {
        super(type, 'modelParser');
    }
}

/**
 * default module parser token.
 */
export const DefaultModelParserToken = new InjectModelParserToken(Object)
