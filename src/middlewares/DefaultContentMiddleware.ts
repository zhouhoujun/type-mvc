import { IContainer, Injectable, Inject, toAbsolutePath } from 'type-autofac';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { ContextSymbol, ContentMiddleware } from '../util';
import { Configuration } from '../index';
import { isString } from 'util';
const serve = require('koa-static');

@Middleware(ContentMiddleware)
export class DefaultContentMiddleware implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {
    }
    setup() {
        let contents = isString(this.config.contents) ? [this.config.contents] : this.config.contents;
        contents.forEach(content => {
            this.app.use(serve(toAbsolutePath(this.config.rootdir, content)));
        })
    }

}
