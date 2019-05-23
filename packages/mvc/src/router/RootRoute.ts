import { BaseRoute } from './BaseRoute';
import { IContainer } from '@tsdi/core';
import { IContext } from '../IContext';
import { Next } from '../util';

/**
 * root route.
 *
 * @export
 * @class RootRoute
 * @extends {BaseRoute}
 */
export class RootRoute extends BaseRoute {

    options(container: IContainer, ctx: IContext, next: Next): Promise<any> {
        return this.match(ctx).options(container, ctx, next);
    }
    navigating(container: IContainer, ctx: IContext, next: Next): Promise<any> {
        return this.match(ctx).navigating(container, ctx, next);
    }
}
