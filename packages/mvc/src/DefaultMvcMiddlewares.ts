const bodyParser = require('koa-bodyparser');
import * as json from 'koa-json';
import { toAbsolutePath } from '@tsdi/platform-server';
import { RouterMiddleware } from './router/RouterMiddleware';
import { MvcMiddlewareType } from './middlewares';
import { InjectToken } from '@tsdi/ioc';
const logger = require('koa-logger')
const serve = require('koa-static');
const session = require('koa-session');
const views = require('koa-views');
const helmet = require('koa-helmet');

/**
 * default middlewares.
 */
export const DefaultMvcMiddlewaresToken = new InjectToken<MvcMiddlewareType[]>('Default_Mvc_Middlewares');


/**
 * default middlewares.
 */
export const DefaultMvcMiddlewares: MvcMiddlewareType[] = [
    () => helmet(),
    () => bodyParser(),
    () => json(),
    () => logger(),
    (config, ctx) => {
        if (config.session) {
            return session(config.session, ctx.getKoa())
        }
    },
    (config, ctx) => {
        let contents = config.contents || ['./public'];
        contents.forEach((content, idx) => {
            let staticPath = toAbsolutePath(ctx.getRootPath(), content);
            console.log(`content path ${idx + 1}:`, staticPath);
            ctx.getKoa().use(serve(staticPath));
        });
    },
    (config, ctx) => {
        let viewPath = toAbsolutePath(ctx.getRootPath(), config.views);
        console.log('view path:', viewPath, config.viewsOptions);
        return views(viewPath, config.viewsOptions);
    },
    RouterMiddleware
];
