import { MvcMiddleware } from '../middlewares';
import { InjectToken } from '@tsdi/ioc';
import { IContext } from '../IContext';
import { RouteChecker } from '../services';

export const RouteUrlArgToken = new InjectToken<string>('route_url');


export abstract class MvcRoute extends MvcMiddleware {

    protected metaUrl: string;
    private _url: string;
    get url(): string {
        if (!this._url) {
            this._url = this.vaildify(this.metaUrl, true);
        }
        return this._url;
    }

    set url(val: string) {
        this._url = val
    }

    constructor(url: string) {
        super();
        if (url) {
            this.metaUrl = url;
        }
    }

    private checker: RouteChecker;
    getChecker() {
        if (!this.checker) {
            this.checker = this.container.get(RouteChecker);
        }
        return this.checker;
    }

    protected getReqRoute(ctx: IContext): string {
        return this.getChecker().getReqRoute(ctx);
    }


    protected vaildify(routePath: string, foreNull = false): string {
        return this.getChecker().vaildify(routePath, foreNull);
    }


    protected math(ctx: IContext): boolean {
        if (ctx.status && ctx.status !== 404) {
            return false;
        }
        return this.getChecker().isActiveRoute(ctx, this.url);
    }

    protected getRouterNext(ctx: IContext): () => Promise<void> {
        return ctx.__routerNext;
    }

    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        if (this.math(ctx)) {
            return this.navigate(ctx, this.getRouterNext(ctx));
        } else {
            return next();
        }
    }

    abstract navigate(ctx: IContext, next: () => Promise<void>): Promise<void>;
}
