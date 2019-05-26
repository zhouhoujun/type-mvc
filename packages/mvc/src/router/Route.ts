import { MvcMiddleware, IContext } from '../middlewares';
import { InjectToken } from '@tsdi/ioc';

export const RouteUrlArgToken = new InjectToken<string>('route_url');

export abstract class MvcRoute extends MvcMiddleware {

    url: string;
    constructor(url: string) {
        super();
        if (url) {
            this.url = this.vaildify(url);
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

    canNavigate(ctx: IContext): boolean {
        return (!ctx.status || ctx.status === 404) && this.url.startsWith(ctx.url);
    }

    vaildify(routPath: string, foreNull = false): string {
        if (foreNull && routPath === '/') {
            routPath = '';
        }
        if (/\/\s*$/.test(routPath)) {
            routPath = routPath.substring(0, routPath.lastIndexOf('/'));
        }
        if (/\?\S*$/.test(routPath)) {
            routPath = routPath.substring(0, routPath.lastIndexOf('?'));
        }
        return routPath;
    }
}
