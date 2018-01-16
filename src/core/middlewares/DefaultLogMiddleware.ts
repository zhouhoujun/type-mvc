import { IContainer, Injectable, Inject } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util';
const logger = require('koa-logger')

@Middleware(mvcSymbols.LogMiddleware)
export class DefaultLogMiddleware implements IMiddleware {

    constructor(private app: Application) {
    }
    setup() {
        this.app.use(logger());
    }

}
