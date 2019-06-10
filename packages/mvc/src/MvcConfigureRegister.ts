import { ConfigureRegister, Handle, BuilderService } from '@tsdi/boot';
import { DebugLogAspect, LogConfigureToken } from '@tsdi/logs';
import { Singleton, isArray, isClass, isFunction, lang } from '@tsdi/ioc';
import { IConfiguration } from './IConfiguration';
import { DefaultMvcMiddlewares, DefaultMvcMiddlewaresToken } from './DefaultMvcMiddlewares';
import { MvcContext } from './MvcContext';
import { MvcModuleMetadata } from './metadata';
import { MvcMiddlewares, MiddlewareRegister } from './middlewares';
import * as http from 'http';
import * as https from 'https';
import { MvcServer } from './MvcServer';
import { RegFor } from '@tsdi/boot';
const mount = require('koa-mount');

@Singleton
export class MvcConfigureRegister extends ConfigureRegister {


    async register(config: IConfiguration, ctx: MvcContext): Promise<void> {

        let orgConfig = config;
        config = ctx.configuration = Object.assign({}, ctx.annoation, config);

        ctx.getKoa().keys = config.keys;

        if (config.debug) {
            this.container.register(DebugLogAspect);
            // disable custom log.
            config.logConfig = null;
        }

        if (!this.container.has(DefaultMvcMiddlewaresToken)) {
            this.container.bindProvider(DefaultMvcMiddlewaresToken, DefaultMvcMiddlewares)
        }

        let metadata = ctx.annoation as MvcModuleMetadata;
        let mvcMiddles = metadata.middlewares || this.container.get(DefaultMvcMiddlewaresToken);
        if (isArray(mvcMiddles)) {
            let middlewares = this.container.get(MvcMiddlewares);
            mvcMiddles.forEach(middle => {
                if (isClass(middle)) {
                    middlewares.use(middle);
                } else if (isFunction(middle)) {
                    let mid = middle(config, ctx);
                    if (isFunction(mid)) {
                        middlewares.use(mid);
                    }
                } else if (middle instanceof Handle) {
                    middlewares.use(middle)
                }
            });
        }

        this.container.invoke(MiddlewareRegister, tag => tag.setup);

        if (!ctx.httpServer) {
            if (config.httpsOptions) {
                ctx.httpServer = https.createServer(config.httpsOptions, ctx.getKoa().callback());
            } else {
                ctx.httpServer = http.createServer(ctx.getKoa().callback());
            }
        }

        if (config.controllers) {
            await this.container.load({
                basePath: ctx.getRootPath(),
                files: config.controllers
            });
        }

        if (config.logConfig) {
            this.container.registerSingleton(LogConfigureToken, config.logConfig);
        }

        if (config.subsites && config.subsites.length) {
            await Promise.all(config.subsites.map(async site => {
                let service = await this.container.get(BuilderService).createRunnable({ module: site.mvcModule, regFor: RegFor.child, configures: [lang.omit(orgConfig, 'subsites')] }) as MvcServer;
                let subCtx = service.getMvcContext();
                let koa = subCtx.getKoa();
                if (koa) {
                    ctx.getKoa().use(mount(site.routePrefix, koa));
                }
            }));
        }
    }
}
