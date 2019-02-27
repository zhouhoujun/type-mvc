import { Middleware, IMiddleware, IApplication, Middlewares } from '@mvx/mvc';
import { toAbsolutePath } from '@ts-ioc/platform-server';
import { DefaultConfigureToken } from '@ts-ioc/bootstrap';

const views = require('koa-views');

@Middleware(Middlewares.Views)
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
