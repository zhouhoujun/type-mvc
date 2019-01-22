import { NonePointcut } from '@ts-ioc/aop';
import { MiddlewareTokens, Middleware, IMiddleware, IApplication } from '@mvx/mvc';
const bodyParser = require('koa-bodyparser');

@NonePointcut
@Middleware(MiddlewareTokens.BodyParser)
export class BodyParserMiddleware implements IMiddleware {

    constructor() {
    }

    setup(app: IApplication) {
        app.use(bodyParser());
    }

}
