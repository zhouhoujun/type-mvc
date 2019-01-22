
import { Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { MiddlewareTokens, IMiddleware } from './IMiddleware';
import { IApplication, ApplicationToken } from '../IApplication';
import { ConfigurationToken, IConfiguration } from '../IConfiguration';
import { IRouter } from '../router';



@Middleware(MiddlewareTokens.Cors)
export class CorsMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    @Inject(ConfigurationToken)
    private config: IConfiguration;

    @Inject(MiddlewareTokens.Router)
    private router: IRouter;

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
