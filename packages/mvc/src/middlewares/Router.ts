import { Token, Inject } from '@ts-ioc/core';
import { IRoute, RootRoute, RouteBuilder, IRouter } from '../router';
import { Middleware } from '../decorators';
import { MiddlewareTokens, IMiddleware } from './IMiddleware';
import { ConfigurationToken, IConfiguration } from '../IConfiguration';
import { ApplicationToken, IApplication } from '../IApplication';



@Middleware(MiddlewareTokens.Router)
export class Router implements IRouter, IMiddleware {

    private root: IRoute;

    constructor(private builder: RouteBuilder, @Inject(ConfigurationToken) private config: IConfiguration) {
        this.root = new RootRoute(config.routePrefix);
    }

    routes(map: IRoute) {
        this.root.add(map);
    }

    register(...controllers: Token<any>[]) {
        this.builder.build(this, ...controllers);
    }

    setup(app: IApplication) {
        app.use(async (ctx, next) => {
            if ((!ctx.status || ctx.status === 404) && this.config.isRouteUrl(ctx.url)) {
                return this.root.navigating(app.container, ctx, next);
            }
        });
    }

    getRoot(): IRoute {
        return this.root;
    }

}
