const bodyParser = require('koa-bodyparser');
import * as json from 'koa-json';
import { toAbsolutePath } from '@tsdi/platform-server';
import { RouterMiddleware } from './router/RouterMiddleware';
import { MvcMiddlewareType, MiddlewareTypes, bindMiddlewareName } from './middlewares';
import { InjectToken } from '@tsdi/ioc';
const logger = require('koa-logger')
const serve = require('koa-static');
const session = require('koa-session');
const views = require('koa-views');
const helmet = require('koa-helmet');
const compose = require('koa-compose');

/**
 * default middlewares.
 */
export const DefaultMvcMiddlewaresToken = new InjectToken<MvcMiddlewareType[]>('Default_Mvc_Middlewares');

/**
 * default middlewares.
 */
export const DefaultMvcMiddlewares: MvcMiddlewareType[] = [
    () => bindMiddlewareName(helmet(), MiddlewareTypes.Helmet),
    () => bindMiddlewareName(logger(), MiddlewareTypes.Logger),
    (config, ctx) => {
        if (config.session) {
            return bindMiddlewareName(session(config.session, ctx.getKoa()), MiddlewareTypes.Session);
        }
        return void 0;
    },
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
];
