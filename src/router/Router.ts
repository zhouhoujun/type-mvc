import { Application } from '../Application';
import { Configuration } from '../Configuration';
import { Middleware } from '../decorators';
import { RequestMethod } from '../RequestMethod';
import { IMiddleware } from '../middlewares';
import { ObjectMap, ActionComponent, Token } from 'type-autofac';
import { IRoute } from './IRoute';
import { magenta } from 'chalk';
import { BaseRoute } from './BaseRoute';
import { RouteBuilder } from './RouteBuilder';
import { RouterMiddleware } from '../util';

export interface IRouter extends IMiddleware {
    routes(map: IRoute);

    register(controllers: Token<any>[]);
}

@Middleware(RouterMiddleware)
export class Router implements IMiddleware {

    private root: IRoute;
    constructor(private builder: RouteBuilder, private app: Application, private config: Configuration) {
        this.root = new BaseRoute(config.routePrefix);
    }

    routes(map: IRoute) {
        this.root.add(map);
    }

    register(controllers: Token<any>[]) {
        this.builder.build(...controllers)
            .forEach(route => {
                this.root.add(route);
            });
    }

    setup() {
        this.app.use(async (ctx, next) => {
            console.log(new Date(), ': ', ctx.url);
            return this.root.math(ctx)
                .naviage(this.app.container, ctx, next);
        });

    }

}
