import { Inject } from '@tsdi/ioc';
import { Middleware, CompositeMiddleware, MiddlewareTypes, IContext, MvcContext, RouteChecker, IConfiguration } from '@mvx/mvc';
import { AuthenticatorToken, IAuthenticator } from '../passports';
import '../passports/IAuthenticator';

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

    @Inject(AuthenticatorToken)
    passport: IAuthenticator;

    private checker: RouteChecker;
    getChecker() {
        if (!this.checker) {
            this.checker = this.getInjector().get(RouteChecker);
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
        return await next();
    }

    protected async setup(context: MvcContext) {
        let configuration: IConfiguration = context.getConfiguration();
        this.use(this.passport.initialize(configuration.passports.initialize || {}));
        this.use(this.passport.session());
    }
}


// @Middleware({
//     name: 'authcheck',
//     scope: 'route'
// })
// export class AuthCheckMiddleware extends MvcMiddleware {
//     @Inject(AuthenticatorToken)
//     passport: IAuthenticator;

//     async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
//         let configuration: IConfiguration = ctx.mvcContext.configuration;
//         if (configuration.passports.default) {
//             let flowOption = configuration.passports.default;
//             await this.passport.authenticate(flowOption.strategy, flowOption.options)(ctx, next);
//         }
//         await next();
//     }
// }
