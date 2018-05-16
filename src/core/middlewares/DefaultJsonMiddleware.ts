import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware, JsonMiddlewareToken } from './IMiddleware';
import { Application, ApplicationToken } from '../Application';
import { IConfiguration, ConfigurationToken } from '../../IConfiguration';
import * as json from 'koa-json';
import { NonePointcut } from '@ts-ioc/aop';

@Middleware(JsonMiddlewareToken)
export class DefaultJsonMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: Application;

    @Inject(ConfigurationToken)
    private config: IConfiguration;

    constructor() {
    }
    setup() {
        this.app.use(json());
    }

}
