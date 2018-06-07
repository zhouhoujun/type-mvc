import { Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware, BodyParserMiddlewareToken } from './IMiddleware';
import { IApplication, ApplicationToken } from '../IApplication';
import { NonePointcut } from '@ts-ioc/aop';
const bodyParser = require('koa-bodyparser');

@NonePointcut
@Middleware(BodyParserMiddlewareToken)

export class DefaultBodyParserMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    constructor() {
    }
    setup() {
        this.app.use(bodyParser());
    }

}
