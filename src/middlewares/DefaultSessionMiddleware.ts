import { IContainer, Injectable, Inject } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { symbols } from '../util';
import { Configuration } from '../Configuration';

const session = require('koa-session');

@Middleware(symbols.SessionMiddleware)
export class DefaultSessionMiddleware implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {
    }
    setup() {
        this.app.use(session(this.config.session, this.app));
    }

}
