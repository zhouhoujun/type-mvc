import { Middleware, IMiddleware, IApplication, Middlewares } from '@mvx/mvc';
import { NonePointcut } from '@tsdi/aop';

const session = require('koa-session');

@NonePointcut
@Middleware(Middlewares.Session)
export class SessionMiddleware implements IMiddleware {

    constructor() {
    }

    setup(app: IApplication) {
        app.useFac((core) => session(app.getConfig().session, core));
    }

}
