import { Middleware, IMiddleware, IApplication, Middlewares } from '@mvx/mvc';
import { toAbsolutePath } from '@ts-ioc/platform-server';

const views = require('koa-views');

@Middleware(Middlewares.Views)
export class ViewsMiddleware implements IMiddleware {

    constructor() {
    }
    setup(app: IApplication) {
        let config = app.getConfig();
        let viewPath = toAbsolutePath(config.rootdir, config.views);
        console.log('view path:', viewPath);
        app.use(views(viewPath, config.viewsOptions));
    }

}
