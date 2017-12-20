import { ResultValue } from './ResultValue';
import { IContext } from '../IContext';
import { IContainer } from 'tsioc';


/**
 * controller method return result type of view.
 * context type 'text/html'
 *
 * @export
 * @class ViewResult
 */
export class ViewResult extends ResultValue {
    constructor(private name: string, private model?: object) {
        super('text/html');
    }

    async sendValue(ctx: IContext, container: IContainer) {
        if (!ctx.render) {
            return Promise.reject('view engin middleware no configed!');
        } else {
            ctx.type = this.contentType;
            return ctx.render(this.name, this.model);
        }
    }
}
