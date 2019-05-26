import {
    Middleware, IMiddleware,
    IApplication,  MiddlewareTypes
} from '@mvx/mvc';
import { NonePointcut } from '@tsdi/aop';
import { toAbsolutePath } from '@tsdi/platform-server';
const serve = require('koa-static');

@NonePointcut
@Middleware(MiddlewareTypes.Content)
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
