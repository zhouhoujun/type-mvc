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
        let { passports } = context.getConfiguration();
        let initOpt = passports.default?.options ?? {};
        this.use(this.passport.initialize({ userProperty: initOpt.userProperty || initOpt.assignProperty, rolesProperty: initOpt.rolesProperty, ...passports.initialize }));
        this.use(this.passport.session());
    }
}
