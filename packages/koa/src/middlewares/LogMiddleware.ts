import { Middleware, IMiddleware, IApplication, MiddlewareTypes } from '@mvx/mvc';
import { NonePointcut } from '@tsdi/aop';
const logger = require('koa-logger')

@NonePointcut
@Middleware(MiddlewareTypes.Log)
export class LogMiddleware implements IMiddleware {

    constructor() {
    }
    setup(app: IApplication) {
        app.use(logger());
    }

}
