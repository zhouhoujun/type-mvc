import { Middleware, CompositeMiddleware, MiddlewareTypes, IContext, MvcContext } from '@mvx/mvc';
import { Inject } from '@tsdi/ioc';
import { MvcPassport } from '../passports';

@Middleware({
    name: 'auth',
    after: MiddlewareTypes.BodyParser
})
export class AuthMiddleware extends CompositeMiddleware {

    private hasInit = false;

    @Inject()
    passport: MvcPassport;

    async execute(ctx: IContext, next?: () => Promise<void>): Promise<void> {
        if (!this.hasInit) {
            await this.setup(ctx.mvcContext);
            this.hasInit = true;
        }
        await super.execute(ctx, next);
    }

    protected async setup(context: MvcContext) {
        this.use(this.passport.initialize());
        this.use(this.passport.session());
    }
}
