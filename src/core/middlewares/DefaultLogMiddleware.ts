import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { MvcSymbols } from '../../util/index';
import { NonePointcut } from '@ts-ioc/aop';
const logger = require('koa-logger')

@NonePointcut
@Middleware(MvcSymbols.LogMiddleware)
export class DefaultLogMiddleware implements IMiddleware {

    constructor(private app: Application) {
    }
    setup() {
        this.app.use(logger());
    }

}
