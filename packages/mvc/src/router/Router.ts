import { CompositeMiddleware } from '../middlewares';
import { Singleton } from '@tsdi/ioc';
import { RouteChecker } from '../services';
import { IContext } from '../IContext';
import { MvcRoute } from './Route';

@Singleton
export class Router extends CompositeMiddleware {

    sorted = false;

    async execute(ctx: IContext, next?: () => Promise<void>): Promise<void> {
        if ((!ctx.status || ctx.status === 404) && this.isRouteUrl(ctx.url)) {
            if (!this.sorted) {
                this.handles = this.handles.sort((a, b) => {
                    if (a instanceof MvcRoute && b instanceof MvcRoute) {
                        return (b.url || '').length - (a.url || '').length;
                    }
                    return -1;
                });
                this.resetFuncs();
                this.sorted = true;
            }

            ctx.__routeNext = next;
            return await super.execute(ctx, next);
        } else {
            return await next();
        }
    }

    getChecker() {
        return this.container.get(RouteChecker);
    }

    isRouteUrl(route: string) {
        return this.getChecker().isRoute(route);
    }

    routes(route: MvcRoute): this {
        this.use(route);
        this.sorted = false;

        return this;
    }
}
