import { IContainer, Injectable, Inject, isString } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application, ApplicationToken } from '../Application';
import { IConfiguration, ConfigurationToken } from '../../IConfiguration';
import { NonePointcut } from '@ts-ioc/aop';
import { toAbsolutePath } from '@ts-ioc/platform-server';
import { MiddlewareToken } from './IMiddleware';
const serve = require('koa-static');

@NonePointcut
@Middleware(MiddlewareToken, 'BodyParser')
export class DefaultContentMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: Application;

    @Inject(ConfigurationToken)
    private config: IConfiguration;

    constructor() {
    }

    setup() {
        let contents = this.config.contents || ['./public'];
        contents.forEach((content, idx) => {
            let staticPath = toAbsolutePath(this.config.rootdir, content);
            console.log(`content path ${idx + 1}:`, staticPath);
            this.app.use(serve(staticPath));
        })
    }

}
