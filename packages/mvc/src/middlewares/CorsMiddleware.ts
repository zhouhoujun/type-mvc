import { Middleware } from '../decorators';
import { IMiddleware, Middlewares } from './IMiddleware';
import { IApplication } from '../IApplication';



@Middleware(Middlewares.Cors)
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
