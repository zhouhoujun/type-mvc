import { Middleware, IMiddleware, Application, IConfiguration, MvcSymbols } from '../../index';
import { IContainer, Injectable, Inject } from '@ts-ioc/core';


@Middleware({ provide: 'logger' })
export class Logger implements IMiddleware {

    constructor(private app: Application, @Inject(MvcSymbols.IConfiguration) private config: IConfiguration) {

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
