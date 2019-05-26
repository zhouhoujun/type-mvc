import { Middleware, IMiddleware, IApplication, MiddlewareTypes } from '@mvx/mvc';
import { toAbsolutePath } from '@tsdi/platform-server';
import { DefaultConfigureToken } from '@tsdi/boot';

const views = require('koa-views');

@Middleware(MiddlewareTypes.Views)
export class ViewsMiddleware implements IMiddleware {

    constructor() {
    }
    setup(app: IApplication) {
        let config = app.getConfig();
        let viewPath = toAbsolutePath(config.baseURL, config.views);
        console.log('view path:', viewPath);
        // console.log('view options:', config.viewsOptions);
        app.use(views(viewPath, config.viewsOptions));
    }

}
