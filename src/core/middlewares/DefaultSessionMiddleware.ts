import { IContainer, Injectable, Inject } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util';
import { Configuration } from '../../Configuration';

const session = require('koa-session');

@Middleware(mvcSymbols.SessionMiddleware)
export class DefaultSessionMiddleware implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {
    }
    setup() {
        this.app.use(session(this.config.session, this.app.getKoa()));
    }

}
