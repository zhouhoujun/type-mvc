import { BaseRoute } from './BaseRoute';
import { IContainer } from '@ts-ioc/core';
import { IContext, Next } from '@mvx/core';

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
