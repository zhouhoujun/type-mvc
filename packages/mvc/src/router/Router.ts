import { HandleType } from '@tsdi/boot';
import { IContext, CompositeMiddleware } from '../middlewares';
import { Singleton } from '@tsdi/ioc';
import { RouteUrlToken } from './Route';
import { CustomRoute, CustomHandleToken } from './CustomRoute';
import { RouteChecker } from '../services';

@Singleton
export class Router extends CompositeMiddleware {

    execute(ctx: IContext, next?: () => Promise<void>): Promise<void> {
        if ((!ctx.status || ctx.status === 404) && this.isRouteUrl(ctx.url)) {
            return super.execute(ctx, next);
        } else {
            return next();
        }
    }

    isRouteUrl(route: string) {
        return this.container.get(RouteChecker).isRoute(route);
    }

    routes(route: string, handle: HandleType<IContext>): this {

        this.use(this.container.resolve(CustomRoute,
            { provide: RouteUrlToken, useValue: route },
            { provide: CustomHandleToken, useValue: handle }));

        return this;
    }
}
