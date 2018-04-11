import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util/index';
import { IConfiguration } from '../../IConfiguration';
import * as json from 'koa-json';
import { NonePointcut } from '@ts-ioc/aop';

@NonePointcut
@Middleware(mvcSymbols.JsonMiddleware)
export class DefaultJsonMiddleware implements IMiddleware {

    constructor(private app: Application, @Inject(mvcSymbols.IConfiguration) private config: IConfiguration) {
    }
    setup() {
        this.app.use(json());
    }

}
