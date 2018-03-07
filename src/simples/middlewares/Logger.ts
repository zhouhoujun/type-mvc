import { Middleware, IMiddleware, Application, IConfiguration, mvcSymbols } from '../../index';
import { IContainer, Injectable, Inject } from 'tsioc';


@Middleware({ provide: 'logger' })
export class Logger implements IMiddleware {

    constructor(private app: Application, @Inject(mvcSymbols.IConfiguration) private config: IConfiguration) {

    }

    setup() {
        this.app.use(async (ctx, next) => {
            let start = Date.now();
            await next();
            const ms = Date.now() - start;
            console.log(`mylog: ${ctx.method} ${ctx.url} - ${ms}ms`);
            let end = new Date();
        });
    }

}
