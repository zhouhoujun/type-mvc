import { Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { MiddlewareTokens, IMiddleware } from './IMiddleware';
import { IApplication } from '../IApplication';
import { IRouter } from '../router';



@Middleware(MiddlewareTokens.Cors)
export class CorsMiddleware implements IMiddleware {


    @Inject(MiddlewareTokens.Router)
    private router: IRouter;

    constructor() {

    }

    setup(app: IApplication) {

        app.use(async (ctx, next) => {
            if ((!ctx.status || ctx.status === 404) && app.getConfig().isRouteUrl(ctx.url)) {
                return this.router.getRoot().options(app.container, ctx, next);
            }
        });
    }

}
