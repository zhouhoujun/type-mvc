import { Middleware, IMiddleware, IContext } from '@mvx/mvc';


@Middleware({ provide: 'logger' })
export class Logger implements IMiddleware {

    constructor() {

    }

    async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        let start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`mylog: ${ctx.method} ${ctx.url} - ${ms}ms`);
        let end = new Date();
    }
}
