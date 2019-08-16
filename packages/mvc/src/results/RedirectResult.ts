import { IContext } from '../IContext';
import { IContainer } from '@tsdi/core';
import { ResultValue } from './ResultValue';

/**
 * redirect url
 *
 * @export
 * @class RedirectResult
 * @extends {ResultValue}
 */
export class RedirectResult extends ResultValue {
    constructor(private url: string, private alt?: string) {
        super('text/html');
    }
    async sendValue(ctx: IContext, container: IContainer) {
        return ctx.redirect(this.url, this.alt);
    }
}
