import { Application } from '../Application';
import { Configuration } from '../../Configuration';
import { Middleware } from '../decorators';
import { RequestMethod } from '../RequestMethod';
import { IMiddleware } from '../middlewares';
import { ObjectMap, ActionComponent, Token } from 'tsioc';
import { IRoute } from './IRoute';
import { RootRoute } from './RootRoute';
import { RouteBuilder } from './RouteBuilder';
import { mvcSymbols } from '../../util';
const compose = require('koa-compose');

export interface IRouter extends IMiddleware {
    routes(map: IRoute);

    register(...controllers: Token<any>[]);

    getRoot(): IRoute;
}

@Middleware(mvcSymbols.RouterMiddleware)
export class Router implements IRouter, IMiddleware {

    private root: IRoute;
    constructor(private builder: RouteBuilder, private app: Application, private config: Configuration) {
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
        // let stack = [];
        // stack.push(async (ctx, next) => {
        //     if (!ctx.status || ctx.status === 404) {
        //         return this.root.options(this.app.container, ctx, next);
        //     }
        // });
        // stack.push(async (ctx, next) => {
        //     if (!ctx.status || ctx.status === 404) {
        //         return this.root.navigating(this.app.container, ctx, next);
        //     }
        // })
        // this.app.use(compose(stack));

    }

    getRoot(): IRoute {
        return this.root;
    }

}
