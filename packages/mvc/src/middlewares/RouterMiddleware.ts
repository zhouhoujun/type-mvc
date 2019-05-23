import { Middleware } from '../decorators';
import { IMiddleware, Middlewares } from '../IMiddleware';
import { IContext } from '../IContext';
import { MvcMiddleware } from './MvcMiddleware';
import { Router } from '../router';



@Middleware(Middlewares.Router)
export class RouterMiddleware extends MvcMiddleware implements IMiddleware {

    async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        if ((!ctx.status || ctx.status === 404) && this.isRouteUrl(ctx.url)) {
            await this.container.get(Router).execute(ctx, next);
            // return app.getRouter().getRoot().navigating(app.container, ctx, next);
        }
    }

    assertUrlRegExp = /\/((\w|%|\.))+\.\w+$/;
    isRouteUrl(ctxUrl: string): boolean {
        let flag = !this.assertUrlRegExp.test(ctxUrl);
        // if (flag && this.routeUrlRegExp) {
        //     return this.routeUrlRegExp.test(ctxUrl);
        // }
        return flag;
    }
}
