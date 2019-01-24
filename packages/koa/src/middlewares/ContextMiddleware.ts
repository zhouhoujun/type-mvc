import { Middleware, IMiddleware, IApplication, ContextToken, Middlewares } from '@mvx/mvc';


@Middleware(Middlewares.Context)
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
