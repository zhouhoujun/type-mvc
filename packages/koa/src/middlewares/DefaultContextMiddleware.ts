import { Inject } from '@ts-ioc/core';
import {
    Middleware, IMiddleware, ContextMiddlewareToken,
    IApplication, ApplicationToken, ContextToken
} from '@mvx/core';


@Middleware(ContextMiddlewareToken)
export class DefaultContextMiddleware implements IMiddleware {

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
