import { Inject } from '@ts-ioc/core';
import { NonePointcut } from '@ts-ioc/aop';
import { MiddlewareTokens, Middleware, IMiddleware, ApplicationToken, IApplication } from '@mvx/mvc';
const bodyParser = require('koa-bodyparser');

@NonePointcut
@Middleware(MiddlewareTokens.BodyParser)
export class BodyParserMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    constructor() {
    }
    setup() {
        this.app.use(bodyParser());
    }

}
