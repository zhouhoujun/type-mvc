import { Middleware, IMiddleware, IApplication, MiddlewareTypes } from '@mvx/mvc';
import * as json from 'koa-json';

@Middleware(MiddlewareTypes.Json)
export class JsonMiddleware implements IMiddleware {

    constructor() {
    }

    setup(app: IApplication) {
        app.use(json());
    }
}
