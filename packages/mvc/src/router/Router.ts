import { HandleType } from '@tsdi/boot';
import { CompositeMiddleware } from '../middlewares';
import { Singleton } from '@tsdi/ioc';
import { RouteUrlArgToken } from './Route';
import { CustomRoute, CustomHandleArgToken } from './CustomRoute';
import { RouteChecker } from '../services';
import { IContext } from '../IContext';

@Singleton
export class Router extends CompositeMiddleware {

    sorted = false;

    execute(ctx: IContext, next?: () => Promise<void>): Promise<void> {
        if ((!ctx.status || ctx.status === 404) && this.isRouteUrl(ctx.url)) {
            if(!this.sorted) {
                this.handles = this.handles.sort((a, b)=> {
                    if(a instanceof CustomRoute && b instanceof CustomRoute){
                        if(b.url > a.url){
                            return 1;
                        } else if(a.url === b.url){
                            return 0;
                        } else {
                            return -1;
                        }
                    }
                    return -1;
                });
                this.sorted = true;

            }
            return super.execute(ctx, next);
        } else {
            return next();
        }
    }

    isRouteUrl(route: string) {
        return this.container.get(RouteChecker).isRoute(route);
    }

    routes(route: string, handle: HandleType<IContext>): this {
        this.use(this.container.resolve(CustomRoute,
            { provide: RouteUrlArgToken, useValue: route },
            { provide: CustomHandleArgToken, useValue: handle }));
        this.sorted = false;

        return this;
    }
}
