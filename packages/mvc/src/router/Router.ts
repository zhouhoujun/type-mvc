import { Singleton } from '@tsdi/ioc';
import { IContext } from '../IContext';
import { CompositeMiddleware } from '../middlewares/MvcMiddleware';
import { RouteChecker } from '../services/RouteChecker';
import { MvcRoute } from './Route';

@Singleton()
export class Router extends CompositeMiddleware {
    static ρNPT = true;
    sorted = false;

    protected vaild(ctx: IContext): boolean {
        return (!ctx.status || ctx.status === 404) && this.isRouteUrl(ctx.url);
    }

    async execute(ctx: IContext, next?: () => Promise<void>): Promise<void> {
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
        await super.execute(ctx);
        if (next) {
            return await next();
        }
    }

    getChecker() {
        return this.getInjector().get(RouteChecker);
    }

    isRouteUrl(route: string) {
        return this.getChecker().isRoute(route);
    }

    routes(...routes: MvcRoute[]): this {
        routes.forEach(r=> this.use(r));
        this.sorted = false;

        return this;
    }
}
