import { Abstract, tokenId, PromiseUtil, Action, isToken, isFunction } from '@tsdi/ioc';
import { IContext } from '../IContext';
import { MvcMiddleware } from '../middlewares/MvcMiddleware';
import { RouteChecker } from '../services/RouteChecker';
import { HandleType } from '@tsdi/boot';

export const RouteUrlArgToken = tokenId<string>('route_url');

@Abstract()
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
            this.checker = this.injector.get(RouteChecker);
        }
        return this.checker;
    }

    protected getReqRoute(ctx: IContext): string {
        return this.getChecker().getReqRoute(ctx);
    }


    protected vaildify(routePath: string, foreNull = false): string {
        return this.getChecker().vaildify(routePath, foreNull);
    }


    protected match(ctx: IContext): boolean {
        if (ctx.status && ctx.status !== 404) {
            return false;
        }
        return this.getChecker().isActiveRoute(ctx, this.url);
    }

    protected getRouteNext(ctx: IContext): () => Promise<void> {
        return ctx.__routeNext;
    }


    execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        if (this.match(ctx)) {
            if (!ctx._corsCheck && ctx.method !== 'OPTIONS') {
                return this.navigate(ctx, this.getRouteNext(ctx));
            } else {
                return this.options(ctx, this.getRouteNext(ctx))
            }
        } else {
            return next();
        }
    }

    abstract navigate(ctx: IContext, next: () => Promise<void>): Promise<void>;

    abstract options(ctx: IContext, next: () => Promise<void>): Promise<void>;

    protected toHandle(handleType: HandleType<IContext>): PromiseUtil.ActionHandle<IContext> {
        if (handleType instanceof Action) {
            return handleType.toAction() as PromiseUtil.ActionHandle<IContext>;
        } else if (isToken(handleType)) {
            return this.injector.get<Action>(handleType)?.toAction?.() as PromiseUtil.ActionHandle<IContext>;
        } else if (isFunction(handleType)) {
            return handleType as PromiseUtil.ActionHandle<IContext>;
        }
        return null;
    }
}
