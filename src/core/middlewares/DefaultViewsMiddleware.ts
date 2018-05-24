import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware, ViewsMiddlewareToken } from './IMiddleware';
import { IApplication, ApplicationToken } from '../IApplication';
import { IConfiguration, ConfigurationToken } from '../../IConfiguration';
import { NonePointcut } from '@ts-ioc/aop';
import { toAbsolutePath } from '@ts-ioc/platform-server';

const views = require('koa-views');

@Middleware(ViewsMiddlewareToken)
export class DefaultViewsMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    @Inject(ConfigurationToken)
    private config: IConfiguration;

    constructor() {
    }
    setup() {
        let viewPath = toAbsolutePath(this.config.rootdir, this.config.views);
        console.log('view path:', viewPath)
        this.app.use(views(viewPath, this.config.viewsOptions));
    }

}
