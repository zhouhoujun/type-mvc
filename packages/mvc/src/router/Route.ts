import { MvcMiddleware } from '../middlewares';
import { IContext } from '../IContext';
import { InjectToken } from '@tsdi/ioc';

export const RouteUrlToken = new InjectToken<string>('route_url');

export abstract class Route extends MvcMiddleware {

    url: string;
    constructor(url: string) {
        super();
        this.url = this.vaildify(url);
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
        return !ctx.status || ctx.status === 404;
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
