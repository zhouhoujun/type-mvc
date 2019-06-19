const bodyParser = require('koa-bodyparser');
import * as json from 'koa-json';
import { toAbsolutePath } from '@tsdi/platform-server';
import { RouterMiddleware } from './router/RouterMiddleware';
import { MvcMiddlewareType, MiddlewareTypes, bindMiddlewareName } from './middlewares';
import { InjectToken } from '@tsdi/ioc';
const logger = require('koa-logger')
const serve = require('koa-static');
const views = require('koa-views');
const helmet = require('koa-helmet');
const compose = require('koa-compose');

/**
 * default middlewares.
 */
export const DefaultMvcMiddlewaresToken = new InjectToken<MvcMiddlewareType[]>('Default_Mvc_Middlewares');

/**
 * get mvc default middlewares.
 *
 * @export
 * @param {boolean} [log=true]
 * @returns
 */
export function getMvcMiddlewares(log = true) {
    return [
        () => bindMiddlewareName(helmet(), MiddlewareTypes.Helmet),
        log ? () => bindMiddlewareName(logger(), MiddlewareTypes.Logger) : null,
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
        (config, ctx) => {
            let viewPath = toAbsolutePath(ctx.getRootPath(), config.views);
            console.log('view path:', viewPath, config.viewsOptions);
            return bindMiddlewareName(views(viewPath, config.viewsOptions), MiddlewareTypes.View);
        },
        RouterMiddleware
    ]
}

/**
 * default middlewares.
 */
export const DefaultMvcMiddlewares: MvcMiddlewareType[] = getMvcMiddlewares();
