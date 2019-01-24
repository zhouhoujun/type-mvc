import { Middleware } from '../decorators';
import { IMiddleware, Middlewares } from './IMiddleware';
import { IApplication } from '../IApplication';



@Middleware(Middlewares.Router)
export class RouterMiddleware implements IMiddleware {


    constructor() {
    }

    setup(app: IApplication) {
        app.use(async (ctx, next) => {
            if ((!ctx.status || ctx.status === 404) && app.getConfig().isRouteUrl(ctx.url)) {
                return app.getRouter().getRoot().navigating(app.container, ctx, next);
            }
        });
    }
}
