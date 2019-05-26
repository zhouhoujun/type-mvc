import { NonePointcut } from '@tsdi/aop';
import { MiddlewareTypes, Middleware, IMiddleware, IApplication } from '@mvx/mvc';
const bodyParser = require('koa-bodyparser');

@NonePointcut
@Middleware(MiddlewareTypes.BodyParser)
export class BodyParserMiddleware implements IMiddleware {

    constructor() {
    }

    setup(app: IApplication) {
        app.use(bodyParser());
    }

}
