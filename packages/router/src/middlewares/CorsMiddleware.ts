import {
    IApplication, ApplicationToken, IConfiguration, ConfigurationToken,
    Middleware, IMiddleware, CorsMiddlewareToken
} from '@mvx/core';
import { Inject } from '@ts-ioc/core';
import { Router, RouterMiddlewareToken } from './Router';

@Middleware(CorsMiddlewareToken)
export class CorsMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    @Inject(ConfigurationToken)
    private config: IConfiguration;

    @Inject(RouterMiddlewareToken)
    private router: Router;

    constructor() {

    }
    setup() {
        this.app.use(async (ctx, next) => {
            if ((!ctx.status || ctx.status === 404) && this.config.isRouteUrl(ctx.url)) {
                return this.router.getRoot().options(this.app.container, ctx, next);
            }
        });
    }

}
