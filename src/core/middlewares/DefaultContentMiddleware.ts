import { IContainer, Injectable, Inject, isString, toAbsolutePath, NonePointcut } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util';
import { IConfiguration } from '../../IConfiguration';
const serve = require('koa-static');

@NonePointcut
@Middleware(mvcSymbols.ContentMiddleware)
export class DefaultContentMiddleware implements IMiddleware {

    constructor(private app: Application, @Inject(mvcSymbols.IConfiguration) private config: IConfiguration) {
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
