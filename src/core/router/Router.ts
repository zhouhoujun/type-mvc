import { Application } from '../Application';
import { IConfiguration } from '../../IConfiguration';
import { Middleware } from '../decorators/index';
import { RequestMethod } from '../RequestMethod';
import { IMiddleware } from '../middlewares/index';
import { ObjectMap, ActionComponent, Token, Inject } from '@ts-ioc/core';
import { IRoute } from './IRoute';
import { RootRoute } from './RootRoute';
import { RouteBuilder } from './RouteBuilder';
import { MvcSymbols } from '../../util/index';
const compose = require('koa-compose');

export interface IRouter extends IMiddleware {
    routes(map: IRoute);

    register(...controllers: Token<any>[]);

    getRoot(): IRoute;
}

@Middleware(MvcSymbols.RouterMiddleware)
export class Router implements IRouter, IMiddleware {

    private root: IRoute;
    constructor(private builder: RouteBuilder, private app: Application, @Inject(MvcSymbols.IConfiguration) private config: IConfiguration) {
        this.root = new RootRoute(config.routePrefix);
    }

    routes(map: IRoute) {
        this.root.add(map);
    }

    register(...controllers: Token<any>[]) {
        this.builder.build(this, ...controllers);
    }


    setup() {

        this.app.use(async (ctx, next) => {
            if ((!ctx.status || ctx.status === 404) && this.config.isRouteUrl(ctx.url)) {
                return this.root.navigating(this.app.container, ctx, next);
            }
        });
    }

    getRoot(): IRoute {
        return this.root;
    }

}
