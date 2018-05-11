import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { MvcSymbols } from '../../util/index';
import { NonePointcut } from '@ts-ioc/aop';
const bodyParser = require('koa-bodyparser');


@Middleware(MvcSymbols.BodyParserMiddleware)
export class DefaultBodyParserMiddleware implements IMiddleware {

    @Inject(MvcSymbols.Application)
    private app: Application;

    constructor() {
    }
    setup() {
        this.app.use(bodyParser());
    }

}
