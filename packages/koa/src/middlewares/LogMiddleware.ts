import { Middleware, IMiddleware, IApplication, MiddlewareTokens } from '@mvx/mvc';
import { NonePointcut } from '@ts-ioc/aop';
const logger = require('koa-logger')

@NonePointcut
@Middleware(MiddlewareTokens.Log)
export class LogMiddleware implements IMiddleware {

    constructor() {
    }
    setup(app: IApplication) {
        app.use(logger());
    }

}
