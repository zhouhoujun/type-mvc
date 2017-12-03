import { IContainer, Injectable, Inject, toAbsolutePath } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { symbols } from '../util';
import { Configuration } from '../Configuration';
import { isString } from 'util';
const serve = require('koa-static');

@Middleware(symbols.ContentMiddleware)
export class DefaultContentMiddleware implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {
    }
    setup() {
        let contents = this.config.contents || ['./public'];
        contents.forEach(content => {
            let staticPath = toAbsolutePath(this.config.rootdir, content);
            this.app.use(serve(staticPath));
        })
    }

}
