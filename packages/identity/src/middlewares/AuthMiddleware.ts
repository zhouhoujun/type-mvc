import { Middleware, CompositeMiddleware, MiddlewareTypes, IContext, MvcContext } from '@mvx/mvc';
import { Inject } from '@tsdi/ioc';
import { Authenticator, PassportBuildService, ConfigurePassportBuildService } from '../passports';

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

    async execute(ctx: IContext, next?: () => Promise<void>): Promise<void> {
        if (!this.hasInit) {
            await this.setup(ctx.mvcContext);
            this.hasInit = true;
        }
        await super.execute(ctx);
        await next();
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
        this.use(this.passport.session());
    }
}
