import { IContainer, Injectable, Inject, toAbsolutePath, NonePointcut } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util/index';
import { IConfiguration } from '../../IConfiguration';

const views = require('koa-views');

@NonePointcut
@Middleware(mvcSymbols.ViewsMiddleware)
export class DefaultViewsMiddleware implements IMiddleware {

    constructor(private app: Application, @Inject(mvcSymbols.IConfiguration) private config: IConfiguration) {
    }
    setup() {
        let viewPath = toAbsolutePath(this.config.rootdir, this.config.views);
        console.log('view path:', viewPath)
        this.app.use(views(viewPath, this.config.viewsOptions));
    }

}
