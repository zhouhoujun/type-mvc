import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { MvcSymbols } from '../../util/index';
import { IConfiguration } from '../../IConfiguration';
import { NonePointcut } from '@ts-ioc/aop';
import { toAbsolutePath } from '@ts-ioc/platform-server';

const views = require('koa-views');

@NonePointcut
@Middleware(MvcSymbols.ViewsMiddleware)
export class DefaultViewsMiddleware implements IMiddleware {

    constructor(private app: Application, @Inject(MvcSymbols.IConfiguration) private config: IConfiguration) {
    }
    setup() {
        let viewPath = toAbsolutePath(this.config.rootdir, this.config.views);
        console.log('view path:', viewPath)
        this.app.use(views(viewPath, this.config.viewsOptions));
    }

}
