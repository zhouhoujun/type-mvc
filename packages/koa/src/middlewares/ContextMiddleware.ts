import { Middleware, IMiddleware, IApplication, ContextToken, MiddlewareTokens } from '@mvx/mvc';


@Middleware(MiddlewareTokens.Context)
export class ContextMiddleware implements IMiddleware {

    constructor() {
    }

    setup(app: IApplication) {
        app.use(async (ctx, next) => {
            app.container.bindProvider(ContextToken, () => ctx);
            return next();
        });
    }
}
