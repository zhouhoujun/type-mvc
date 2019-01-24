import { Middleware, IMiddleware, IApplication, Middlewares } from '@mvx/mvc';
import * as json from 'koa-json';

@Middleware(Middlewares.Json)
export class JsonMiddleware implements IMiddleware {

    constructor() {
    }

    setup(app: IApplication) {
        app.use(json());
    }
}
