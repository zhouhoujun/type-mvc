import { Middleware, IMiddleware, IApplication, MiddlewareTokens } from '@mvx/mvc';
import { NonePointcut } from '@ts-ioc/aop';

const session = require('koa-session');

@NonePointcut
@Middleware(MiddlewareTokens.Session)
export class SessionMiddleware implements IMiddleware {

    constructor() {
    }

    setup(app: IApplication) {
        app.use(session(app.getConfig().session, app.getServer()));
    }

}
