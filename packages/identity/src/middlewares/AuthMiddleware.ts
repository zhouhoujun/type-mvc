import { Middleware, CompositeMiddleware, MiddlewareTypes, IContext, MvcContext, RouteChecker, ContextToken, IConfiguration, MvcMiddleware } from '@mvx/mvc';
import { Inject } from '@tsdi/ioc';
import { AuthenticatorToken, IAuthenticator } from '../passports';
import { AuthRoutesToken } from '../registers/ControllerAuthRegisterAction';
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

    protected async setup(context: MvcContext) {
        let configuration = context.configuration as IConfiguration;
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
//         let configuration = ctx.mvcContext.configuration as IConfiguration;
//         if (configuration.passports.default) {
//             let flowOption = configuration.passports.default;
//             await this.passport.authenticate(flowOption.strategy, flowOption.options)(ctx, next);
//         }
//         await next();
//     }
// }
