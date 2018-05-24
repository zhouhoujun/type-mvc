import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware, LogMiddlewareToken } from './IMiddleware';
import { IApplication, ApplicationToken } from '../IApplication';
import { NonePointcut } from '@ts-ioc/aop';
const logger = require('koa-logger')

@NonePointcut
@Middleware(LogMiddlewareToken)
export class DefaultLogMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    constructor() {
    }
    setup() {
        this.app.use(logger());
    }

}
