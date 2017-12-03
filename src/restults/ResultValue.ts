import { IContext } from '../IContext';
import { IContainer } from 'tsioc';

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

    abstract sendValue(ctx: IContext, container: IContainer): Promise<any>;
}
