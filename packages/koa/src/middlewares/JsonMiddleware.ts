import { Middleware, IMiddleware, IApplication, MiddlewareTokens } from '@mvx/mvc';
import * as json from 'koa-json';

@Middleware(MiddlewareTokens.Json)
export class JsonMiddleware implements IMiddleware {

    constructor() {
    }

    setup(app: IApplication) {
        app.use(json());
    }

}
