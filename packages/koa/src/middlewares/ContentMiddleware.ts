import {
    Middleware, IMiddleware,
    IApplication,  Middlewares
} from '@mvx/mvc';
import { NonePointcut } from '@ts-ioc/aop';
import { toAbsolutePath } from '@ts-ioc/platform-server';
const serve = require('koa-static');

@NonePointcut
@Middleware(Middlewares.Content)
export class ContentMiddleware implements IMiddleware {

    constructor() {
    }

    setup(app: IApplication) {
        let config = app.getConfig();
        let contents = config.contents || ['./public'];
        contents.forEach((content, idx) => {
            let staticPath = toAbsolutePath(config.baseURL, content);
            console.log(`content path ${idx + 1}:`, staticPath);
            app.use(serve(staticPath));
        })
    }

}
