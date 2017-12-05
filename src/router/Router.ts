import { Application } from '../Application';
import { Configuration } from '../Configuration';
import { Middleware } from '../decorators';
import { RequestMethod } from '../RequestMethod';
import { IMiddleware } from '../middlewares';
import { ObjectMap, ActionComponent, Token } from 'tsioc';
import { IRoute } from './IRoute';
import { RootRoute } from './RootRoute';
import { RouteBuilder } from './RouteBuilder';
import { symbols } from '../util';

export interface IRouter extends IMiddleware {
    routes(map: IRoute);

    register(...controllers: Token<any>[]);

    getRoot(): IRoute;
}

@Middleware(symbols.RouterMiddleware)
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
            if (!ctx.status || ctx.status === 404) {
                return this.root.options(this.app.container, ctx, next);
            }
        });

        this.app.use(async (ctx, next) => {
            if (!ctx.status || ctx.status === 404) {
                return this.root.navigating(this.app.container, ctx, next);
            }
        });

    }

    getRoot(): IRoute {
        return this.root;
    }

}
