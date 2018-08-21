import { Singleton, IContainer, lang } from '@ts-ioc/core';
import { IApplication, AppModuleBuilderToken, ApplicationToken } from './IApplication';
import { ModuleBuilder, AppConfigureToken } from '@ts-ioc/bootstrap';
import { IConfiguration, ConfigurationToken } from './IConfiguration';
import { LogConfigureToken } from '@ts-ioc/logs';
import { DebugLogAspect, AuthAspect } from './aop';
import { Configuration } from './Configuration';
import { App } from './decorators';

/**
 * mvc applaction module builder.
 *
 * @export
 * @class AppModuleBuilder
 */
@Singleton(AppModuleBuilderToken)
export class AppModuleBuilder extends ModuleBuilder<IApplication> {

    getDecorator() {
        return App.toString();
    }

    protected async registerExts(container: IContainer, config: IConfiguration): Promise<IContainer> {
        await super.registerExts(container, config);

        let globCfg = container.get(AppConfigureToken) as IConfiguration;
        globCfg.rootdir = globCfg.rootdir || globCfg.baseURL;
        config = lang.assign(globCfg, config) as IConfiguration;
        container.bindProvider(ConfigurationToken, config);
        container.bindProvider(Configuration, config as Configuration);

        let builder = container.getBuilder();
        // custom config.
        if (config.middlewares) {
            let modules = await builder.loadModule(container, {
                basePath: config.rootdir,
                files: config.middlewares
            });
            config.useMiddlewares = modules;

        }

        if (config.controllers) {
            let controllers = await builder.loadModule(container, {
                basePath: config.rootdir,
                files: config.controllers
            });
            if (!config.usedControllers || config.usedControllers.length < 1) {
                config.usedControllers = controllers;
            }
        }

        if (config.logConfig) {
            container.registerSingleton(LogConfigureToken, config.logConfig);
        }

        if (config.debug) {
            container.register(DebugLogAspect);
        }
        container.register(AuthAspect);

        if (config.aop) {
            let aops = await builder.loadModule(container, {
                basePath: config.rootdir,
                files: config.aop
            });

            config.usedAops = aops;
        }
        return container;
    }

    // async build(token?: Token<IApp> | IConfiguration, defaults?: IContainer | LoadedModule, data?: any): Promise<IApp> {
    //     let app = await super.build(token, defaults, data);
    //     let chain = app.container.get(MiddlewareChainToken);
    //     chain.setup(app);
    // }

    // /**
    //  * bootstrap mvc application with App Module.
    //  *
    //  * @template T
    //  * @param {Token<IApp>} [token]
    //  * @returns {Promise<T>}
    //  * @memberof Bootstrap
    //  */
    // async bootstrap(token?: Token<IApp> | IConfiguration, defaults?: IContainer | LoadedModule, data?: any): Promise<IApp> {
    //     token = token || Application;
    //     let app: IApp = await super.bootstrap(token);

    //     if (!(app instanceof Application)) {
    //         throw new Error('configuration bootstrap or bootstrap with module is not right application implements IApplication.');
    //     }
    //     let container = await this.getContainer();
    //     container.bindProvider(ApplicationToken, app);

    //     app.setup(this.beforeSMdls, this.afterSMdls);

    //     let config = container.get(ConfigurationToken);
    //     let server = app.getHttpServer();
    //     let port = config.port || parseInt(process.env.PORT || '0');
    //     if (config.hostname) {
    //         server.listen(port, config.hostname, this._listener);
    //     } else {
    //         server.listen(port, this._listener);
    //     }

    //     console.log('service listen on port: ', port);
    //     return app as T;
    // }

    // protected getModuleConfigure(builder: IModuleBuilder<IApp>, appModule: Token<IApp> | Type<any>): IConfiguration {
    //     let cfg: IConfiguration = builder.getConfigure(appModule, AppModule) as IConfiguration;
    //     if (lang.hasField(cfg)) {
    //         return cfg;
    //     }
    //     return super.getModuleConfigure(builder, appModule) as IConfiguration;
    // }

    // protected async registerConfgureDepds(container: IContainer, config: IConfiguration): Promise<IConfiguration> {
    //     await super.registerConfgureDepds(container, config);

    //     return config;
    // }

    // protected async initContainer(config: IConfiguration, container: IContainer): Promise<IContainer> {

    //     if (!container.has(AopModule)) {
    //         container.register(AopModule);
    //     }
    //     if (!container.has(LogModule)) {
    //         container.register(LogModule);
    //     }

    //     await super.initContainer(config, container);

    //     container.bindProvider(ConfigurationToken, config);
    //     container.bindProvider(Configuration, config as Configuration);

    //     this.registerDefaults(container);

    //     let builder = this.getContainerBuilder();

    //     // custom use.
    //     if (this.middlewares) {
    //         await builder.loadModule(container, ...this.middlewares.filter(m => isClass(m)) as Type<any>[]);
    //     }

    //     // custom config.
    //     if (config.middlewares) {
    //         let modules = await builder.loadModule(container, {
    //             basePath: config.rootdir,
    //             files: config.middlewares
    //         });
    //         if (!config.useMiddlewares || config.useMiddlewares.length < 1) {
    //             config.useMiddlewares = this.middlewares.concat(modules);
    //         } else {
    //             config.useMiddlewares = this.middlewares.concat(config.useMiddlewares);
    //         }
    //     }

    //     if (config.controllers) {
    //         let controllers = await builder.loadModule(container, {
    //             basePath: config.rootdir,
    //             files: config.controllers
    //         });
    //         if (!config.useControllers || config.useControllers.length < 1) {
    //             config.useControllers = controllers;
    //         }
    //     }

    //     if (config.logConfig) {
    //         container.registerSingleton(LogConfigureToken, config.logConfig);
    //     }

    //     if (config.debug) {
    //         container.register(DebugLogAspect);
    //     }
    //     container.register(AuthAspect);

    //     if (config.aop) {
    //         let aops = await builder.loadModule(container, {
    //             basePath: config.rootdir,
    //             files: config.aop
    //         });

    //         config.usedAops = aops;
    //     }

    //     let servers = await builder.loadModule(container, ...this.beforeSMdls.concat(this.afterSMdls).filter(m => isClass(m)) as Type<any>[]);
    //     if (servers && servers.length) {
    //         config.usedServerMiddlewares = servers;
    //     }

    //     return container;
    // }

    // protected getDefaultConfig(): IConfiguration {
    //     return lang.assign({}, new Configuration());
    // }

}

