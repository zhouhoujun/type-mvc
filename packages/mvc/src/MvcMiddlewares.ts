import { IContext, CompositeMiddleware } from './middlewares';
import { Singleton } from '@tsdi/ioc';
import { MvcContext } from './MvcContext';
import { ConfigureMgrToken } from '@tsdi/boot';
import { IConfiguration } from './IConfiguration';
import { toAbsolutePath } from '@tsdi/platform-server';
const bodyParser = require('koa-bodyparser');
import * as json from 'koa-json';
import { RouterMiddleware } from './router/RouterMiddleware';
const logger = require('koa-logger')
const serve = require('koa-static');
const session = require('koa-session');
const views = require('koa-views');

@Singleton
export class MvcMiddlewares extends CompositeMiddleware {

    async setup(ctx: IContext, mvcContext: MvcContext) {
        let container = mvcContext.getRaiseContainer();
        let config = await container.get(ConfigureMgrToken).getConfig() as IConfiguration;

        this.use(bodyParser())
            .use(json())
            .use(logger())
            .use(session(config.session, mvcContext.runnable));

        let contents = config.contents || ['./public'];
        contents.forEach((content, idx) => {
            let staticPath = toAbsolutePath(config.baseURL, content);
            console.log(`content path ${idx + 1}:`, staticPath);
            this.use(serve(staticPath));
        });

        let viewPath = toAbsolutePath(config.baseURL, config.views);
        console.log('view path:', viewPath);
        // console.log('view options:', config.viewsOptions);
        this.use(views(viewPath, config.viewsOptions));

        this.use(RouterMiddleware);

        ctx.use((ctx, next) => {
            ctx.mvcContext = mvcContext;
            return this.execute(ctx, next)
        });
    }

    protected setupDefault() {

    }
}

