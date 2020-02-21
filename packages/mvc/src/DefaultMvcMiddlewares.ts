const bodyParser = require('koa-bodyparser');
import * as json from 'koa-json';
import { tokenId } from '@tsdi/ioc';
import { toAbsolutePath } from '@tsdi/platform-server';
import { MvcMiddlewareType, MiddlewareTypes, bindMiddlewareName } from './middlewares/IMiddleware';
import { RouterMiddleware } from './router/RouterMiddleware';
import { CorsMiddleware } from './router/CorsMiddleware';
const logger = require('koa-logger');
const serve = require('koa-static');
const views = require('koa-views');
const helmet = require('koa-helmet');
const compose = require('koa-compose');

/**
 * default middlewares.
 */
export const DefaultMvcMiddlewaresToken = tokenId<MvcMiddlewareType[]>('DEFAULT_MVC_MIDDLEWARES');

/**
 * default middlewares.
 */
export const DefaultMvcMiddlewares: MvcMiddlewareType[] = [
    () => bindMiddlewareName(helmet(), MiddlewareTypes.Helmet),
    () => bindMiddlewareName(logger(), MiddlewareTypes.Logger),
    () => bindMiddlewareName(bodyParser(), MiddlewareTypes.BodyParser),
    () => bindMiddlewareName(json(), MiddlewareTypes.Json),
    (config, ctx) => {
        let contents = config.contents || ['./public'];
        let serves = contents.map((content, idx) => {
            let staticPath = toAbsolutePath(ctx.getRootPath(), content);
            console.log(`content path ${idx + 1}:`, staticPath);
            return serve(staticPath);
        });
        return bindMiddlewareName(compose(serves), MiddlewareTypes.Content);
    },
    CorsMiddleware,
    (config, ctx) => {
        let viewPath = toAbsolutePath(ctx.getRootPath(), config.views);
        console.log('view path:', viewPath, config.viewsOptions);
        return bindMiddlewareName(views(viewPath, config.viewsOptions), MiddlewareTypes.View);
    },
    RouterMiddleware
];
