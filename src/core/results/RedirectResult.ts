import { IContext } from '../IContext';
import { IContainer } from 'tsioc';
import { ResultValue } from './ResultValue';

export class RedirectResult extends ResultValue {
    constructor(private url: string, private alt?: string) {
        super('text/html');
    }
    async sendValue(ctx: IContext, container: IContainer) {
        // ctx.type = this.contentType;
        return ctx.redirect(this.url, this.alt);
    }
}
