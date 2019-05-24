import { HandleType } from '@tsdi/boot';
import { CompositeMiddleware } from '../middlewares';
import { IContext } from '../IContext';
import { Singleton } from '@tsdi/ioc';
import { Route } from './Route';
import { isString } from 'util';

@Singleton
export class Router extends CompositeMiddleware {

    execute(ctx: IContext, next?: () => Promise<void>): Promise<void> {
        if ((!ctx.status || ctx.status === 404) && this.isRouteUrl(ctx.url)) {
            return super.execute(ctx, next);
        } else {
            return next();
        }
    }

    private assertUrlRegExp = /\/((\w|%|\.))+\.\w+$/;
    isRouteUrl(ctxUrl: string): boolean {
        return !this.assertUrlRegExp.test(ctxUrl);
        // if (flag && this.routeUrlRegExp) {
        //     return this.routeUrlRegExp.test(ctxUrl);
        // }
    }

    routes(route: string | Route, handle?: HandleType<IContext>): this {
        if (route instanceof Route) {
            this.use(route);
        } else if (isString(route) && handle) {
            this.use()
        }
        return this;
    }
}
