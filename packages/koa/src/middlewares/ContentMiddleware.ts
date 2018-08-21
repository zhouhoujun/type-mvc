import { Inject } from '@ts-ioc/core';
import {
    Middleware, IMiddleware,
    IApplication, ApplicationToken,
    IConfiguration, ConfigurationToken, MiddlewareTokens
} from '@mvx/mvc';
import { NonePointcut } from '@ts-ioc/aop';
import { toAbsolutePath } from '@ts-ioc/platform-server';
const serve = require('koa-static');

@NonePointcut
@Middleware(MiddlewareTokens.Content)
export class ContentMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    @Inject(ConfigurationToken)
    private config: IConfiguration;

    constructor() {
    }

    setup() {
        let contents = this.config.contents || ['./public'];
        contents.forEach((content, idx) => {
            let staticPath = toAbsolutePath(this.config.rootdir, content);
            console.log(`content path ${idx + 1}:`, staticPath);
            this.app.use(serve(staticPath));
        })
    }

}
