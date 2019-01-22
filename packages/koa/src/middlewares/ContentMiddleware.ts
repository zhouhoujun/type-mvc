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

    constructor() {
    }

    setup(app: IApplication) {
        let config = app.getConfig();
        let contents = config.contents || ['./public'];
        contents.forEach((content, idx) => {
            let staticPath = toAbsolutePath(config.rootdir, content);
            console.log(`content path ${idx + 1}:`, staticPath);
            app.use(serve(staticPath));
        })
    }

}
