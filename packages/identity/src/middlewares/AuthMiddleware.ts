import { Middleware, CompositeMiddleware, MiddlewareTypes, IContext, MvcContext, RouteChecker, PassportConfigure } from '@mvx/mvc';
import { Inject } from '@tsdi/ioc';
import { Authenticator, PassportBuildService, ConfigurePassportBuildService } from '../passports';
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
    after: MiddlewareTypes.BodyParser
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
        await next();
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
        let services = context.getRaiseContainer().getServices(PassportBuildService);
        // config build first.
        let cfs = services.find(s => s instanceof ConfigurePassportBuildService);
        if (cfs && services.indexOf(cfs) > 0) {
            services.splice(services.indexOf(cfs), 1);
            services.unshift(cfs);
        }
        await Promise.all(services.map(s => s.build(this.passport, context.configuration)));
        this.use(this.passport.initialize());
        this.use(async (ctx, next) => {
            if (this.reuqireAuth(ctx)) {
                let container = ctx.getRaiseContainer();
                let flow = container.getService(AuthFlowService);
                if (flow) {
                    await flow.auth(ctx, next);
                } else {
                    if (context.configuration.passports.default) {
                        let flowOption = context.configuration.passports.default;
                        await this.passport.authenticate(flowOption.strategy, flowOption.options)(ctx, next);
                    } else {
                        await this.passport.session()(ctx, next);
                    }
                }
            } else {
                return await next();
            }
        });
    }
}
