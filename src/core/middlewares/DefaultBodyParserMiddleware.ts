import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware, BodyParserMiddlewareToken } from './IMiddleware';
import { Application, ApplicationToken } from '../Application';
import { NonePointcut } from '@ts-ioc/aop';
const bodyParser = require('koa-bodyparser');

@NonePointcut
@Middleware(BodyParserMiddlewareToken)

export class DefaultBodyParserMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: Application;

    constructor() {
    }
    setup() {
        this.app.use(bodyParser());
    }

}
