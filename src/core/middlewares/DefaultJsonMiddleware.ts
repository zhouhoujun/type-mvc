import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { MvcSymbols } from '../../util/index';
import { IConfiguration } from '../../IConfiguration';
import * as json from 'koa-json';
import { NonePointcut } from '@ts-ioc/aop';

@Middleware(MvcSymbols.JsonMiddleware)
export class DefaultJsonMiddleware implements IMiddleware {

    @Inject(MvcSymbols.Application)
    private app: Application;

    @Inject(MvcSymbols.IConfiguration)
    private config: IConfiguration;

    constructor() {
    }
    setup() {
        this.app.use(json());
    }

}
