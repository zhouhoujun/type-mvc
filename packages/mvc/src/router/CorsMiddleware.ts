import { MvcMiddleware, IMiddleware, MiddlewareTypes } from '../middlewares';
import { Router } from './Router';
import { Inject, Singleton } from '@tsdi/ioc';
import { IContext } from '../IContext';


@Singleton
export class CorsMiddleware extends MvcMiddleware implements IMiddleware {

    static middleName = MiddlewareTypes.Router;

    @Inject()
    private router: Router;

    async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        if ((!ctx.status || ctx.status === 404) && this.router.isRouteUrl(ctx.url)) {
            ctx.__cors = true;
            await this.container.get(Router).execute(ctx, next);
        }
    }
}
