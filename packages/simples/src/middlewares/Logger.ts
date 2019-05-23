import { NonePointcut } from '@tsdi/aop';
import { Middleware, IMiddleware, IConfiguration, ConfigurationToken, ApplicationToken, IApplication } from '@mvx/mvc';
import { IContainer, Injectable, Inject } from '@tsdi/core';


@NonePointcut
@Middleware({ provide: 'logger' })
export class Logger implements IMiddleware {

    constructor() {

    }

    setup(app: IApplication) {
        app.use(async (ctx, next) => {
            let start = Date.now();
            await next();
            const ms = Date.now() - start;
            console.log(`mylog: ${ctx.method} ${ctx.url} - ${ms}ms`);
            let end = new Date();
        });
    }

}
