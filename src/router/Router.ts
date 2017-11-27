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

    register(...controllers: Token<any>[]);

    getRoot(): IRoute;
}

@Middleware(RouterMiddleware)
export class Router implements IRouter, IMiddleware {

    private root: IRoute;
    constructor(private builder: RouteBuilder, private app: Application, private config: Configuration) {
        this.root = new BaseRoute(config.routePrefix);
    }

    routes(map: IRoute) {
        this.root.add(map);
    }

    register(...controllers: Token<any>[]) {
        console.log('register controllers', ...controllers);
        this.builder.build(this, ...controllers)
            .forEach(route => {
                this.root.add(route);
            });
    }


    setup() {
        console.log('has setup router');
        this.app.use(async (ctx, next) => {
            console.log('router:::', ctx.url);
            await this.root.match(ctx).navigate(this.app.container, ctx);
            await next();
        });

    }

    getRoot(): IRoute {
        return this.root;
    }

}
