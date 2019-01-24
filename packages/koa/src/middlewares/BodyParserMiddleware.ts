import { NonePointcut } from '@ts-ioc/aop';
import { Middlewares, Middleware, IMiddleware, IApplication } from '@mvx/mvc';
const bodyParser = require('koa-bodyparser');

@NonePointcut
@Middleware(Middlewares.BodyParser)
export class BodyParserMiddleware implements IMiddleware {

    constructor() {
    }

    setup(app: IApplication) {
        app.use(bodyParser());
    }

}
