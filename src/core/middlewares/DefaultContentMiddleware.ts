import { IContainer, Injectable, Inject, isString } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { MvcSymbols } from '../../util/index';
import { IConfiguration } from '../../IConfiguration';
import { NonePointcut } from '@ts-ioc/aop';
import { toAbsolutePath } from '@ts-ioc/platform-server';
const serve = require('koa-static');

@Middleware(MvcSymbols.ContentMiddleware)
export class DefaultContentMiddleware implements IMiddleware {

    @Inject(MvcSymbols.Application)
    private app: Application;

    @Inject(MvcSymbols.IConfiguration)
    private config: IConfiguration;

    constructor() {
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
