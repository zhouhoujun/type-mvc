import { Component, AfterInit, HandleType } from '@tsdi/boot';
import { Route } from './Route';
import { CompositeMiddleware } from '../middlewares';
import { IContext } from '../IContext';

@Component
export class Router extends CompositeMiddleware {

    async execute(ctx: IContext, next?: () => Promise<void>): Promise<void> {
        if ((!ctx.status || ctx.status === 404) && this.isRouteUrl(ctx.url)) {
            await super.execute(ctx, next);
        } else {
            await next();
        }
    }

    private assertUrlRegExp = /\/((\w|%|\.))+\.\w+$/;
    isRouteUrl(ctxUrl: string): boolean {
        return !this.assertUrlRegExp.test(ctxUrl);
        // if (flag && this.routeUrlRegExp) {
        //     return this.routeUrlRegExp.test(ctxUrl);
        // }
    }

    routes(route: string, handle: HandleType<IContext>) {
     
    }
}
