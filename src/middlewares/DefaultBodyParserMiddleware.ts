import { IContainer, Injectable, Inject } from 'type-autofac';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { BodyParserMiddleware } from '../util';
const bodyParser = require('koa-bodyparser');

@Middleware(BodyParserMiddleware)
export class DefaultBodyParserMiddleware implements IMiddleware {

    constructor(private app: Application) {
    }
    setup() {
        this.app.use(bodyParser());
    }

}
