import { ConfigureRegister, Handle } from '@tsdi/boot';
import { DebugLogAspect, LogConfigureToken } from '@tsdi/logs';
import { Singleton, isArray, isClass, isFunction, Refs } from '@tsdi/ioc';
import { IConfiguration } from './IConfiguration';
import { DefaultMvcMiddlewares, DefaultMvcMiddlewaresToken } from './DefaultMvcMiddlewares';
import { MvcContext } from './MvcContext';
import { MvcModuleMetadata } from './metadata';
import { MvcMiddlewares } from './middlewares';
import * as http from 'http';
import * as https from 'https';


@Singleton
export class MvcConfigureRegister extends ConfigureRegister {
    constructor() {
        super();
    }
    async register(config: IConfiguration, ctx: MvcContext): Promise<void> {

        config = ctx.configuration = Object.assign({}, ctx.annoation, config);

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
    }
}
