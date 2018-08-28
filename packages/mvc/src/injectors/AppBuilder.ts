import { AnnotationBuilder, AppConfigureToken } from '@ts-ioc/bootstrap';
import { IApplication, AppBuilderToken } from '../IApplication';
import { IConfiguration, ConfigurationToken } from '../IConfiguration';
import { Injectable, lang, Token } from '@ts-ioc/core';
import { Application } from '../Application';
import { Configuration } from '../Configuration';
import { LogConfigureToken } from '@ts-ioc/logs';
import { DebugLogAspect, AuthAspect } from '../aop';
import { ModelParser } from '../model';
import { BaseController } from '../BaseController';
import { MiddlewareChain } from '../middlewares';
import { CorsMiddleware } from '../router';

@Injectable(AppBuilderToken)
export class AppBuilder extends AnnotationBuilder<IApplication> {

    async buildStrategy(app: IApplication, config: IConfiguration): Promise<IApplication> {
        if (app instanceof Application) {
            let chain = app.middlewareChain;
            chain.use(...config.useMiddlewares);
            chain.setup(app);
        }
        return app;
    }

    protected async registerExts(config?: IConfiguration) {
        let builder = this.container.getBuilder();
            if (config.models) {
                await builder.loadModule(this.container, {
                    basePath: config.rootdir,
                    files: config.models
                });
            }
            // custom config.
            if (config.middlewares) {
                let modules = await builder.loadModule(this.container, {
                    basePath: config.rootdir,
                    files: config.middlewares
                });
                config.useMiddlewares = modules;

            }

            if (config.controllers) {
                let controllers = await builder.loadModule(this.container, {
                    basePath: config.rootdir,
                    files: config.controllers
                });
                if (!config.usedControllers || config.usedControllers.length < 1) {
                    config.usedControllers = controllers;
                }
            }

            if (config.logConfig) {
                this.container.registerSingleton(LogConfigureToken, config.logConfig);
            }

            if (config.debug) {
                this.container.register(DebugLogAspect);
            }
            this.container.register(AuthAspect);

            if (!this.container.has(ModelParser)) {
                this.container.register(ModelParser);
            }

            if (!this.container.has(BaseController)) {
                this.container.register(BaseController);
            }

            if (!this.container.has(MiddlewareChain)) {
                this.container.register(MiddlewareChain);
            }

            if (!this.container.has(CorsMiddleware)) {
                this.container.register(CorsMiddleware);
            }


            if (config.aop) {
                let aops = await builder.loadModule(this.container, {
                    basePath: config.rootdir,
                    files: config.aop
                });

                config.usedAops = aops;
            }
    }

    protected getTokenMetaConfig(token: Token<IApplication>, config?: IConfiguration): IConfiguration {
        let metaConfig = super.getTokenMetaConfig(token, config);
        let globCfg = this.container.get(AppConfigureToken) as IConfiguration;
        globCfg.rootdir = globCfg.rootdir || globCfg.baseURL;
        metaConfig = lang.assign(globCfg, metaConfig) as IConfiguration;
        this.container.bindProvider(ConfigurationToken, metaConfig);
        this.container.bindProvider(Configuration, metaConfig as Configuration);
        return metaConfig;
    }
}
