import { IApplication, ApplicationToken } from '../IApplication';
import { IConfiguration, ConfigurationToken } from '../../IConfiguration';
import { Middleware } from '../decorators';
import { IMiddleware, CorsMiddlewareToken } from '../middlewares/index';
import { Inject } from '@ts-ioc/core';
import { Router, RouterMiddlewareToken } from '../router/index';

@Middleware(CorsMiddlewareToken)
export class DefaultCorsMiddleware implements IMiddleware {

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
