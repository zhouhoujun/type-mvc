import { IContext } from '../middlewares';
import { IContainer } from '@tsdi/core';

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
     * @param {IContainer} container
     * @returns {Promise<any>}
     * @memberof ResultValue
     */
    abstract sendValue(ctx: IContext, container: IContainer): Promise<any>;
}
