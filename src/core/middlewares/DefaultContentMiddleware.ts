import { IContainer, Injectable, Inject, isString, toAbsolutePath } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { symbols } from '../../util';
import { Configuration } from '../../Configuration';
const serve = require('koa-static');

@Middleware(symbols.ContentMiddleware)
export class DefaultContentMiddleware implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {
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
