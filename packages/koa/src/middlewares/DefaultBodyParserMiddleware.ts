import { Inject } from '@ts-ioc/core';
import { Middleware, IMiddleware, BodyParserMiddlewareToken, IApplication, ApplicationToken } from '@mvx/core';
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
