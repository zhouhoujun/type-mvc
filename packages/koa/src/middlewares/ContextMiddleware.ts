import { Inject } from '@ts-ioc/core';
import { Middleware, IMiddleware, IApplication, ApplicationToken, ContextToken, MiddlewareTokens } from '@mvx/mvc';


@Middleware(MiddlewareTokens.Context)
export class ContextMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    constructor() {
    }

    setup() {
        this.app.use(async (ctx, next) => {
            this.app.container.unregister(ContextToken);
            this.app.container.bindProvider(ContextToken, () => ctx);
            return next();
        });
    }

}
