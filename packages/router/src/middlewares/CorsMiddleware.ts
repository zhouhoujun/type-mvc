import {
    IApp, ApplicationToken, IConfiguration, ConfigurationToken,
    Middleware, IMiddleware, Middlewares
} from '@mvx/mvc';
import { Inject } from '@ts-ioc/core';
import { Router, RouterMiddlewareToken } from './Router';

@Middleware(Middlewares.Cors)
export class CorsMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApp;

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
