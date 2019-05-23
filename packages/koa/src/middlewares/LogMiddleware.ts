import { Middleware, IMiddleware, IApplication, Middlewares } from '@mvx/mvc';
import { NonePointcut } from '@tsdi/aop';
const logger = require('koa-logger')

@NonePointcut
@Middleware(Middlewares.Log)
export class LogMiddleware implements IMiddleware {

    constructor() {
    }
    setup(app: IApplication) {
        app.use(logger());
    }

}
