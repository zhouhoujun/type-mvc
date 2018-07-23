import { Inject } from '@ts-ioc/core';
import { Middleware, IMiddleware, IApplication, ApplicationToken, LogMiddlewareToken } from '@mvx/core';
import { NonePointcut } from '@ts-ioc/aop';
const logger = require('koa-logger')

@NonePointcut
@Middleware(LogMiddlewareToken)
export class DefaultLogMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    constructor() {
    }
    setup() {
        this.app.use(logger());
    }

}
