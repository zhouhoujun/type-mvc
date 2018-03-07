import { IContainer, Injectable, Inject, NonePointcut } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util';
import { IConfiguration } from '../../IConfiguration';

const session = require('koa-session');

@NonePointcut
@Middleware(mvcSymbols.SessionMiddleware)
export class DefaultSessionMiddleware implements IMiddleware {

    constructor(private app: Application, @Inject(mvcSymbols.IConfiguration) private config: IConfiguration) {
    }
    setup() {
        this.app.use(session(this.config.session, this.app.getKoa()));
    }

}
