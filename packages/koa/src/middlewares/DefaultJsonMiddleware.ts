import { Inject } from '@ts-ioc/core';
import { Middleware, IMiddleware, JsonMiddlewareToken, IApplication, IConfiguration, ConfigurationToken, ApplicationToken } from '@mvx/core';
import * as json from 'koa-json';

@Middleware(JsonMiddlewareToken)
export class DefaultJsonMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    @Inject(ConfigurationToken)
    private config: IConfiguration;

    constructor() {
    }
    setup() {
        this.app.use(json());
    }

}
