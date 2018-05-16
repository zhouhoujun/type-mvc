import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { NonePointcut } from '@ts-ioc/aop';
import { MiddlewareToken } from '.';
const bodyParser = require('koa-bodyparser');

@NonePointcut
@Middleware(MiddlewareToken, 'BodyParser')
export class DefaultBodyParserMiddleware implements IMiddleware {

    constructor(private app: Application) {
    }
    setup() {
        this.app.use(bodyParser());
    }

}
