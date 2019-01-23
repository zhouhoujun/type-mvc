import { Middleware } from '../decorators';
import { MiddlewareTokens, IMiddleware } from './IMiddleware';
import { IApplication } from '../IApplication';



@Middleware(MiddlewareTokens.Cors)
export class CorsMiddleware implements IMiddleware {

    constructor() {

    }

    setup(app: IApplication) {

        app.use(async (ctx, next) => {
            if ((!ctx.status || ctx.status === 404) && app.getConfig().isRouteUrl(ctx.url)) {
                return app.getRouter().getRoot().options(app.container, ctx, next);
            }
        });
    }

}
