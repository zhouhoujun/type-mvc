import { IContainer, Injectable, Inject, toAbsolutePath } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util';
import { Configuration } from '../../Configuration';

const views = require('koa-views');

@Middleware(mvcSymbols.ViewsMiddleware)
export class DefaultViewsMiddleware implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {
    }
    setup() {
        let viewPath = toAbsolutePath(this.config.rootdir, this.config.views);
        console.log('view path:', viewPath)
        this.app.use(views(viewPath, this.config.viewsOptions));
    }

}
