import { Middleware, CompositeMiddleware, MiddlewareTypes, IContext, MvcContext } from '@mvx/mvc';
import { Inject } from '@tsdi/ioc';
import { Authenticator, PassportBuildService } from '../passports';

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
        await super.execute(ctx, next);
    }

    protected async setup(context: MvcContext) {
        let services = context.getRaiseContainer().getServices(PassportBuildService);
        await Promise.all(services.map(s => s.build(this.passport, context.configuration)));
        this.use(this.passport.initialize());
        this.use(this.passport.session());
    }
}
