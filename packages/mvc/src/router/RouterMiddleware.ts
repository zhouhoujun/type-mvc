import { IContext, MvcMiddleware, IMiddleware } from '../middlewares';
import { Router } from './Router';
import { Inject, Singleton } from '@tsdi/ioc';


@Singleton
export class RouterMiddleware extends MvcMiddleware implements IMiddleware {

    @Inject()
    private router: Router;

    async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        if ((!ctx.status || ctx.status === 404) && this.router.isRouteUrl(ctx.url)) {
            await this.container.get(Router).execute(ctx, next);
        }
    }
}
