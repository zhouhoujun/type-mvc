import { IConfiguration, ConfigurationToken } from './IConfiguration';
import { Configuration } from './Configuration';
import { IContainer, isClass, Type, Token, lang } from '@ts-ioc/core';
import { toAbsolutePath } from '@ts-ioc/platform-server';
import { AuthAspect, DebugLogAspect } from './aop';
import { AopModule } from '@ts-ioc/aop';
import { LogModule, LogConfigureToken } from '@ts-ioc/logs';
import { IApplication } from './IApplication';
import { ModuleBuilder, LoadedModule } from '@ts-ioc/bootstrap';
import { Application } from './Application';
import { MiddlewareChainToken } from './middlewares/MiddlewareChain';

/**
 * mvc applaction builder.
 *
 * @export
 * @class AppBuilder
 */
export class ApplicationBuilder extends ModuleBuilder<IApplication> {

    async build(token?: Token<IApplication> | IConfiguration, defaults?: IContainer | LoadedModule, data?: any): Promise<IApplication> {
        let app = await super.build(token, defaults, data);
        let chain = app.container.get(MiddlewareChainToken);
        chain.setup(app);
    }

    /**
     * bootstrap mvc application with App Module.
     *
     * @template T
     * @param {Token<IApplication>} [token]
     * @returns {Promise<T>}
     * @memberof Bootstrap
     */
    async bootstrap(token?: Token<IApplication> | IConfiguration, defaults?: IContainer | LoadedModule, data?: any): Promise<IApplication> {
        token = token || Application;
        let app: IApplication = await super.bootstrap(token);

        if (!(app instanceof Application)) {
            throw new Error('configuration bootstrap or bootstrap with module is not right application implements IApplication.');
        }
        let container = await this.getContainer();
        container.bindProvider(ApplicationToken, app);

        app.setup(this.beforeSMdls, this.afterSMdls);

        let config = container.get(ConfigurationToken);
        let server = app.getHttpServer();
        let port = config.port || parseInt(process.env.PORT || '0');
        if (config.hostname) {
            server.listen(port, config.hostname, this._listener);
        } else {
            server.listen(port, this._listener);
        }

        console.log('service listen on port: ', port);
        return app as T;
    }


    protected setConfigRoot(config: IConfiguration) {
        config.rootdir = config.rootdir ? toAbsolutePath(this.rootdir, config.rootdir) : this.rootdir;
    }

    protected getDefaultConfig() {
        return new Configuration();
    }

    protected getModuleConfigure(builder: IModuleBuilder<IApplication>, appModule: Token<IApplication> | Type<any>): IConfiguration {
        let cfg: IConfiguration = builder.getConfigure(appModule, AppModule) as IConfiguration;
        if (lang.hasField(cfg)) {
            return cfg;
        }
        return super.getModuleConfigure(builder, appModule) as IConfiguration;
    }

    protected async registerConfgureDepds(container: IContainer, config: IConfiguration): Promise<IConfiguration> {
        await super.registerConfgureDepds(container, config);
        
        return config;
    }

    protected async initContainer(config: IConfiguration, container: IContainer): Promise<IContainer> {

        if (!container.has(AopModule)) {
            container.register(AopModule);
        }
        if (!container.has(LogModule)) {
            container.register(LogModule);
        }

        await super.initContainer(config, container);

        container.bindProvider(ConfigurationToken, config);
        container.bindProvider(Configuration, config as Configuration);

        this.registerDefaults(container);

        let builder = this.getContainerBuilder();

        // custom use.
        if (this.middlewares) {
            await builder.loadModule(container, ...this.middlewares.filter(m => isClass(m)) as Type<any>[]);
        }

        // custom config.
        if (config.middlewares) {
            let modules = await builder.loadModule(container, {
                basePath: config.rootdir,
                files: config.middlewares
            });
            if (!config.useMiddlewares || config.useMiddlewares.length < 1) {
                config.useMiddlewares = this.middlewares.concat(modules);
            } else {
                config.useMiddlewares = this.middlewares.concat(config.useMiddlewares);
            }
        }

        if (config.controllers) {
            let controllers = await builder.loadModule(container, {
                basePath: config.rootdir,
                files: config.controllers
            });
            if (!config.useControllers || config.useControllers.length < 1) {
                config.useControllers = controllers;
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

        let servers = await builder.loadModule(container, ...this.beforeSMdls.concat(this.afterSMdls).filter(m => isClass(m)) as Type<any>[]);
        if (servers && servers.length) {
            config.usedServerMiddlewares = servers;
        }

        return container;
    }

    // protected async registerExts(container: IContainer, config: IConfiguration): Promise<IContainer> {
    //     await super.registerExts(container, config);
    //     return container;
    // }

}

