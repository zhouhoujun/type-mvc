import {
    IApplication, ApplicationToken, IConfiguration, ConfigurationToken,
    Middleware, IMiddleware, Middlewares, MiddlewareTokens
} from '@mvx/mvc';
import { Inject } from '@ts-ioc/core';
import { Router } from './Router';

@Middleware(Middlewares.Cors)
export class CorsMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    @Inject(ConfigurationToken)
    private config: IConfiguration;

    @Inject(MiddlewareTokens.Router)
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
