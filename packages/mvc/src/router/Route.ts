import { Abstract, tokenId, Action, isToken, isFunction, AsyncHandler, isClass } from '@tsdi/ioc';
import { HandleType } from '@tsdi/boot';
import { IContext } from '../IContext';
import { MvcMiddleware } from '../middlewares/MvcMiddleware';
import { RouteChecker } from '../services/RouteChecker';


export const RouteUrlArgToken = tokenId<string>('route_url');

@Abstract()
export abstract class MvcRoute extends MvcMiddleware {
    static ρNPT = true;
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
            this.checker = this.getInjector().get(RouteChecker);
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

    async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        if (this.match(ctx)) {
            await this.navigate(ctx, next);
        } else {
            return await next();
        }
    }

    abstract navigate(ctx: IContext, next: () => Promise<void>): Promise<void>;

    protected toHandle(handleType: HandleType<IContext>): AsyncHandler<IContext> {
        if (handleType instanceof Action) {
            return handleType.toAction() as AsyncHandler<IContext>;
        } else if (isClass(handleType)) {
            const ist = this.getInjector().get(handleType) ?? this.getInjector().getContainer().getTypeReflects().getInjector(handleType).getInstance(handleType);
            return ist?.toAction?.() as AsyncHandler<IContext>;
        } else if (isToken(handleType)) {
            return this.getInjector().get<Action>(handleType)?.toAction?.() as AsyncHandler<IContext>;
        } else if (isFunction(handleType)) {
            return handleType as AsyncHandler<IContext>;
        }
        return null;
    }
}
