import { HandleType } from '@tsdi/boot';
import { CompositeMiddleware } from '../middlewares';
import { Singleton, PromiseUtil } from '@tsdi/ioc';
import { RouteUrlArgToken } from './Route';
import { CustomRoute, CustomHandleArgToken } from './CustomRoute';
import { RouteChecker } from '../services';
import { IContext } from '../IContext';

@Singleton
export class Router extends CompositeMiddleware {

    sorted = false;

    execute(ctx: IContext, next?: () => Promise<void>): Promise<void> {
        if ((!ctx.status || ctx.status === 404) && this.isRouteUrl(ctx.url)) {
            if (!this.sorted) {
                this.handles = this.handles.sort((a, b) => {
                    if (a instanceof CustomRoute && b instanceof CustomRoute) {
                        return (b.url || '').length - (a.url || '').length;
                    }
                    return -1;
                });
                this.resetFuncs();
                this.sorted = true;
            }
            ctx.__routerNext = next;
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
            { provide: RouteUrlArgToken, useValue: route },
            { provide: CustomHandleArgToken, useValue: handle }));
        this.sorted = false;

        return this;
    }
}
