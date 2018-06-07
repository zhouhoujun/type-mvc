import { Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware, JsonMiddlewareToken } from './IMiddleware';
import { IApplication, ApplicationToken } from '../IApplication';
import { IConfiguration, ConfigurationToken } from '../../IConfiguration';
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
