import { Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware, SessionMiddlewareToken } from './IMiddleware';
import { IApplication, ApplicationToken } from '../IApplication';
import { IConfiguration, ConfigurationToken } from '../../IConfiguration';
import { NonePointcut } from '@ts-ioc/aop';

const session = require('koa-session');

@NonePointcut
@Middleware(SessionMiddlewareToken)
export class DefaultSessionMiddleware implements IMiddleware {

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
