import { Middleware, CompositeMiddleware, MiddlewareTypes, IContext, MvcContext, RouteChecker, ContextToken } from '@mvx/mvc';
import { Inject } from '@tsdi/ioc';
import { Authenticator } from '../passports';
import { AuthRoutesToken } from '../registers/ControllerAuthRegisterAction';
import { AuthFlowService } from './AuthFlowService';

/**
 * authentication middleware.
 *
 * @export
 * @class AuthMiddleware
 * @extends {CompositeMiddleware}
 */
@Middleware({
    name: 'auth',
    before: MiddlewareTypes.View
})
export class AuthMiddleware extends CompositeMiddleware {

    private hasInit = false;

    @Inject()
    passport: Authenticator;

    private checker: RouteChecker;
    getChecker() {
        if (!this.checker) {
            this.checker = this.container.get(RouteChecker);
        }
        return this.checker;
    }


    async execute(ctx: IContext, next?: () => Promise<void>): Promise<void> {
        if (!this.hasInit) {
            await this.setup(ctx.mvcContext);
            this.hasInit = true;
        }
        await super.execute(ctx);
        ctx.passport = this.passport;
        ctx.getRaiseContainer().bindProvider(ContextToken, ctx);
        return await next();
    }

    reuqireAuth(ctx: IContext): boolean {
        let checker = this.getChecker();
        if (!checker.isRoute(ctx.url)) {
            return false;
        }
        let route = checker.getReqRoute(ctx);
        return Array.from(ctx.getRaiseContainer().resolve(AuthRoutesToken))
            .some(r => r && route.startsWith(r))

    }

    protected async setup(context: MvcContext) {
        this.use(this.passport.initialize());
        this.use(async (ctx, next) => {
            if (this.reuqireAuth(ctx)) {
                await next();
            }
        })
        this.use(this.passport.session());
        this.use(async (ctx, next) => {
            let container = ctx.getRaiseContainer();
            let flow = container.getService(AuthFlowService);
            if (flow) {
                await flow.auth(ctx, next);
            } else {
                if (context.configuration.passports.default) {
                    let flowOption = context.configuration.passports.default;
                    await this.passport.authenticate(flowOption.strategy, flowOption.options)(ctx, next);
                }
            }
        });
    }
}
