import { IContainer, Injectable, Inject, toAbsolutePath } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { symbols } from '../util';
import { Configuration } from '../index';
import { isString } from 'util';
const serve = require('koa-static');

@Middleware(symbols.ContentMiddleware)
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
