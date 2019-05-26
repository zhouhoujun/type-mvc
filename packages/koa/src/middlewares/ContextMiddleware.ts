import { Middleware, IMiddleware, IApplication, ContextToken, MiddlewareTypes } from '@mvx/mvc';


@Middleware(MiddlewareTypes.Context)
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
