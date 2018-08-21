import { Inject } from '@ts-ioc/core';
import { Middleware, IMiddleware, IApplication, ApplicationToken, MiddlewareTokens } from '@mvx/mvc';
import * as json from 'koa-json';

@Middleware(MiddlewareTokens.Json)
export class JsonMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    constructor() {
    }
    setup() {
        this.app.use(json());
    }

}
