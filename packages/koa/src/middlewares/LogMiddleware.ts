import { Inject } from '@ts-ioc/core';
import { Middleware, IMiddleware, IApplication, ApplicationToken, MiddlewareTokens } from '@mvx/mvc';
import { NonePointcut } from '@ts-ioc/aop';
const logger = require('koa-logger')

@NonePointcut
@Middleware(MiddlewareTokens.Log)
export class LogMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    constructor() {
    }
    setup() {
        this.app.use(logger());
    }

}
