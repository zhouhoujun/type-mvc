import { Type, InjectToken } from '@tsdi/ioc';

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
 * default module parser token.
 */
export const DefaultModelParserToken = new InjectToken<IModelParser<any>>('DefaultModelParser')
