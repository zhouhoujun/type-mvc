import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { MvcSymbols } from '../../util/index';
import { IConfiguration } from '../../IConfiguration';
import { NonePointcut } from '@ts-ioc/aop';

const session = require('koa-session');

@NonePointcut
@Middleware(MvcSymbols.SessionMiddleware)
export class DefaultSessionMiddleware implements IMiddleware {

    constructor(private app: Application, @Inject(MvcSymbols.IConfiguration) private config: IConfiguration) {
    }
    setup() {
        this.app.use(session(this.config.session, this.app.getKoa()));
    }

}
