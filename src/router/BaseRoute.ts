import { IComponent, Composite, Type, IContainer } from 'type-autofac';
import { IContext } from '../IContext';
import { Next } from '../util';
import { IRoute, RouteAction } from './IRoute';






export class BaseRoute extends Composite implements IRoute {
    constructor(route: string, private action?: RouteAction) {
        super(route);
    }

    math(ctx: IContext) {
        return this.find(r => {
            return r.name === ctx.req.url
        }) as IRoute;
    }

    naviage(container: IContainer, ctx: IContext, next: Next) {
        if (this.action) {
            return this.action(ctx, next);
        } else {
            return next();
        }
    }

}
