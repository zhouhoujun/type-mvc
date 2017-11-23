import { Application } from '../Application';
import { Configuration } from '../Configuration';
import { Middleware, Router } from '../decorators';
import { RequestMethod } from '../RequestMethod';
import { IMiddleware } from '../middlewares';
import { ObjectMap, ActionComponent } from 'type-autofac';
import { MvcRoute, IRoute } from './MvcRoute';

@Middleware
@Router
export class MvcRouter implements IMiddleware {

    private routeMap: IRoute;
    constructor(private app: Application, private config: Configuration) {
        this.routeMap = new MvcRoute(config.routePrefix);
    }

    routes(method: RequestMethod, express: string, action: Function) {

    }

    get(express: string, action: Function) {

    }

    setup() {
        this.app.use(async (ctx, next) => {
            this.routeMap.math(ctx)
                .naviage(this.app.container, ctx, next);
        });

    }

}
