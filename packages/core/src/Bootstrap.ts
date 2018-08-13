import { IConfiguration, ConfigurationToken } from './IConfiguration';
import { Configuration } from './Configuration';
import { IContainer, isClass, isFunction, Type, Token, hasClassMetadata, lang, LoadType, isToken } from '@ts-ioc/core';
import { toAbsolutePath } from '@ts-ioc/platform-server';
import { AuthAspect, DebugLogAspect } from './aop';
import { Log4jsAdapter } from './logAdapter/Log4jsAdapter';
import { AopModule } from '@ts-ioc/aop';
import { LogModule, LogConfigureToken } from '@ts-ioc/logs';
import { IMiddleware, CustomMiddleware } from './middlewares';
import { ApplicationBuilder } from '@ts-ioc/platform-server/bootstrap';
import { IApplication } from './IApplication';
import { IApplicationBuilder } from '@ts-ioc/bootstrap';
import { Middleware } from './decorators';
import { Application } from './Application';
import { CoreModule } from './CoreModule';

/**
 * mvc applaction builder.
 *
 * @export
 * @class AppBuilder
 */
export class MvcContainer {

    middlewares: CustomMiddleware[];
    /**
     * Creates an instance of WebApplication.
     * @param {string} rootdir
     * @param {Type<any>} [appType]
     * @memberof WebApplication
     */
    constructor(public rootdir: string) {
        this.middlewares = [];
    }

    protected container: IContainer;
    getContainer(): IContainer {
        if (!this.container) {
            this.container = this.getBuilder().getPools().getDefault();
        }
        return this.container;
    }


    protected builder: IApplicationBuilder<any>;
    getBuilder(): IApplicationBuilder<any> {
        if (!this.builder) {
            this.builder = this.createAppBuilder();
            this.builder
                .use(AopModule)
                .use(LogModule)
                .use(CoreModule);
        }
        return this.builder;
    }

    protected createAppBuilder() {
        return new ApplicationBuilder(this.rootdir);
    }

    /**
     * create new application.
     *
     * @static
     * @param {string} rootdir
     * @returns
     * @memberof WebApplication
     */
    static create(rootdir: string) {
        return new MvcContainer(rootdir);
    }


    /**
     * use module, middleware or CustomMiddleware.
     *
     * @param {...(CustomMiddleware | LoadType)[]} middleware
     * @returns {this}
     * @memberof Bootstrap
     */
    use(...modules: (CustomMiddleware | LoadType)[]): this {
        let appBuilder = this.getBuilder();
        modules.forEach(md => {
            if (isToken(md)) {
                appBuilder.use(md);
            } else if (isFunction(md)) {
                this.middlewares.push(md);
            }
        });

        return this;
    }

    private _listener: Function;
    useListener(listener: Function) {
        this._listener = listener;
    }

    /**
     * bootstrap mvc application with App Module.
     *
     * @template T
     * @param {Token<T>} [appModule]
     * @returns {Promise<T>}
     * @memberof Bootstrap
     */
    async bootstrap<T extends IApplication>(appModule?: Token<T> | Configuration): Promise<T> {
        let appType: Token<IApplication> = appModule || Application;
        let app: IApplication = await super.bootstrap(appType);

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

    protected registerDefaults(container: IContainer) {
        registerDefaults(container);
        container.register(Log4jsAdapter);
    }

}
