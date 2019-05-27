import { MvcMiddleware, IContext } from '../middlewares';
import { InjectToken } from '@tsdi/ioc';

export const RouteUrlArgToken = new InjectToken<string>('route_url');

export abstract class MvcRoute extends MvcMiddleware {

    url: string;
    constructor(url: string) {
        super();
        if (url) {
            this.url = this.vaildify(url, true);
        }
    }

    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        if (this.canNavigate(ctx)) {
            return this.navigate(ctx, next);
        } else {
            return next();
        }
    }

    abstract navigate(ctx: IContext, next: () => Promise<void>): Promise<void>;

    protected getReqRoute(ctx: IContext): string {
        let reqUrl = this.vaildify(ctx.url, true);
        if (ctx.mvcContext.configuration.routePrefix) {
            return reqUrl.replace(ctx.mvcContext.configuration.routePrefix, '');
        }
        return reqUrl;
    }

    protected canNavigate(ctx: IContext): boolean {
        if (ctx.status && ctx.status !== 404) {
            return false;
        }
        let routeUrl = this.getReqRoute(ctx);
        if (this.url === '') {
            return true;
        }
        return routeUrl.startsWith(this.url);
    }

    protected vaildify(routePath: string, foreNull = false): string {
        if (foreNull && routePath === '/') {
            routePath = '';
        }
        if (/\/\s*$/.test(routePath)) {
            routePath = routePath.substring(0, routePath.lastIndexOf('/'));
        }
        if (/\?\S*$/.test(routePath)) {
            routePath = routePath.substring(0, routePath.lastIndexOf('?'));
        }
        return routePath;
    }
}
