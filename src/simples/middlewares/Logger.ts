import { Middleware, IMiddleware, Application, Configuration } from '../../index';
import { IContainer, Injectable } from 'type-autofac';


@Middleware({ provide: 'logger' })
export class Logger implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {

    }

    setup() {
        this.app.use(async (ctx, next) => {
            let start = Date.now();
            await next();
            const ms = Date.now() - start;
            console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
            let end = new Date();
        });
    }

}
