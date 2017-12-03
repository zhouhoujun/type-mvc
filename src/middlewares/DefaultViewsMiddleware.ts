import { IContainer, Injectable, Inject } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { symbols } from '../util';
import { Configuration } from '../Configuration';

const views = require('koa-views');
import { join } from 'path';

@Middleware(symbols.ViewsMiddleware)
export class DefaultViewsMiddleware implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {
    }
    setup() {
        this.app.use(views(join(this.config.rootdir, this.config.views), this.config.viewsOptions));
    }

}
