import { IContainer, Injectable, Inject, isString } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util/index';
import { IConfiguration } from '../../IConfiguration';
import { NonePointcut } from '@ts-ioc/aop';
import { toAbsolutePath } from '@ts-ioc/platform-server';
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
