import { IContainer, Injectable, Inject } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util/index';
const bodyParser = require('koa-bodyparser');

@Middleware(mvcSymbols.BodyParserMiddleware)
export class DefaultBodyParserMiddleware implements IMiddleware {

    constructor(private app: Application) {
    }
    setup() {
        this.app.use(bodyParser());
    }

}
