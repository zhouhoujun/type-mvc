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

    protected getRouteNext(ctx: IContext): () => Promise<void> {
        return ctx.__routeNext;
    }

    protected getCorsNext(ctx: IContext): () => Promise<void> {
        return ctx.__corsNext;
    }

    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        if (this.math(ctx)) {
            if (!ctx._corsCheck && ctx.method !== 'OPTIONS') {
                return this.navigate(ctx, this.getRouteNext(ctx));
            } else {
                return this.options(ctx, this.getCorsNext(ctx))
            }
        } else {
            return next();
        }
    }

    abstract navigate(ctx: IContext, next: () => Promise<void>): Promise<void>;

    abstract options(ctx: IContext, next: () => Promise<void>): Promise<void>;
}
