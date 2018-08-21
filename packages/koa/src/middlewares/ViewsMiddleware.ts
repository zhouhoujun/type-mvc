import { Inject } from '@ts-ioc/core';
import { Middleware, IMiddleware, IApplication, IConfiguration, ConfigurationToken, ApplicationToken, MiddlewareTokens } from '@mvx/mvc';
import { toAbsolutePath } from '@ts-ioc/platform-server';

const views = require('koa-views');

@Middleware(MiddlewareTokens.Views)
export class ViewsMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: IApplication;

    @Inject(ConfigurationToken)
    private config: IConfiguration;

    constructor() {
    }
    setup() {
        let viewPath = toAbsolutePath(this.config.rootdir, this.config.views);
        console.log('view path:', viewPath)
        this.app.use(views(viewPath, this.config.viewsOptions));
    }

}
