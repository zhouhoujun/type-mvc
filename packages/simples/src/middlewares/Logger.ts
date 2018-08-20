import { NonePointcut } from '@ts-ioc/aop';
import { Middleware, IMiddleware, Application, IConfiguration, ConfigurationToken, ApplicationToken } from '@mvx/mvc';
import { IContainer, Injectable, Inject } from '@ts-ioc/core';


@NonePointcut
@Middleware({ provide: 'logger' })
export class Logger implements IMiddleware {

    constructor(@Inject(ApplicationToken) private app: Application, @Inject(ConfigurationToken) private config: IConfiguration) {

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
