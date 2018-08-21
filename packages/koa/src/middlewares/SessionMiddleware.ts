import { Inject } from '@ts-ioc/core';
import { Middleware, IMiddleware, IApplication, IConfiguration, ConfigurationToken, ApplicationToken, MiddlewareTokens } from '@mvx/mvc';
import { NonePointcut } from '@ts-ioc/aop';

const session = require('koa-session');

@NonePointcut
@Middleware(MiddlewareTokens.Session)
export class SessionMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    @Inject(ConfigurationToken)
    private config: IConfiguration;

    constructor() {
    }

    setup() {
        this.app.use(session(this.config.session, this.app.getServer()));
    }

}
