import { Middleware } from '../decorators';
import { Middlewares } from '../IMiddleware';
import { MvcMiddleware } from './MvcMiddleware';
import { IContext } from '../IContext';



@Middleware(Middlewares.Cors)
export class CorsMiddleware extends MvcMiddleware {

    async execute(ctx: IContext, next: () => Promise<void>) {
        if ((!ctx.status || ctx.status === 404) && app.getConfig().isRouteUrl(ctx.url)) {
            return app.getRouter().getRoot().options(app.container, ctx, next);
        }
    }
}
