import { Middleware, IMiddleware, IContext, MvcMiddleware, ForbiddenError, MiddlewareTypes } from '@mvx/mvc';


@Middleware({ name: 'logger-test', after: MiddlewareTypes.Helmet })
export class Logger extends MvcMiddleware {

    async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        let start = Date.now();
        console.log('mylog:', ctx.method, ctx.url);
        await next();
        const ms = Date.now() - start;
        console.log(`mylog: ${ctx.method} ${ctx.url} - ${ms}ms`);
    }
}


