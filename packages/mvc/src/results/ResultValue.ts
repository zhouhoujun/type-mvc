import { IContext } from '../IContext';

/**
 * controller method return result type.
 *
 * @export
 * @abstract
 * @class ResultValue
 */
export abstract class ResultValue {

    constructor(public contentType: string) {
    }

    /**
     * send value.
     *
     * @abstract
     * @param {IContext} ctx

     * @returns {Promise<any>}
     * @memberof ResultValue
     */
    abstract sendValue(ctx: IContext): Promise<any>;
}
