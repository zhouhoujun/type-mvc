import { Middleware } from 'koa';
import { IConfiguration, ConfigurationToken } from './IConfiguration';
import { Configuration } from './Configuration';
import { IContainer, isClass, isFunction, Type, Token, hasClassMetadata, getTypeMetadata, IModuleBuilder, lang } from '@ts-ioc/core';
import { toAbsolutePath, ServerApplicationBuilder, IServerApplicationBuilder } from '@ts-ioc/platform-server';
import { IApplication, Application, IMiddleware, registerDefaults, ApplicationToken, AppModule } from './core/index';

import { AuthAspect, DebugLogAspect } from './aop/index';
import { Log4jsAdapter } from './logAdapter/Log4jsAdapter';
import { AopModule } from '@ts-ioc/aop';
import { LogModule, LogConfigureToken } from '@ts-ioc/logs';
import { IServerMiddleware, ServerMiddleware } from './core/servers/index';

/**
 * mvc applaction bootstrap.
 *
 * @export
 * @class Bootstrap
 */
export class Bootstrap extends ServerApplicationBuilder<IApplication> implements IServerApplicationBuilder<IApplication> {

    private beforeSMdls: any[];
    private afterSMdls: any[];
    private middlewares: Token<any>[];
    /**
     * Creates an instance of WebApplication.
     * @param {string} rootdir
     * @param {Type<any>} [appType]
     * @memberof WebApplication
     */
    constructor(rootdir: string) {
        super(rootdir);
        this.middlewares = [];
        this.beforeSMdls = [];
        this.afterSMdls = [];
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
        return new Bootstrap(rootdir);
    }


    /**
     * use middleware `fn` or  `MiddlewareFactory`.
     *
     * @param {(IMiddleware | Middleware | Token<any>)} middleware
     * @returns {this}
     * @memberof Bootstrap
     */
    use(middleware: IMiddleware | Middleware | Token<any>): this {
        this.middlewares.push(middleware as Type<any>);
        return this;
    }

    useServer(middleware: ServerMiddleware | Token<IServerMiddleware>, afterMvc = true): this {
        if (afterMvc) {
            this.afterSMdls.push(middleware);
        } else {
            this.beforeSMdls.push(middleware);
        }
        return this;
    }

    private _listener: Function;
    useListener(listener: Function) {
        this._listener = listener;
    }

    /**
     * use boostrap to start application.
     *
     * @template T
     * @param {Type<T>} [appModule]
     * @returns {Promise<T>}
     * @memberof Bootstrap
     */
    async run<T extends IApplication>(appModule?: Token<T> | Type<any>): Promise<T> {
        return this.bootstrap(appModule);
    }

    /**
     * bootstrap mvc application with App Module.
     *
     * @template T
     * @param {Token<T>} [appModule]
     * @returns {Promise<T>}
     * @memberof Bootstrap
     */
    async bootstrap<T extends IApplication>(appModule?: Token<T> | Type<any>): Promise<T> {
        let appType: Token<IApplication> = appModule || Application;
        let app: IApplication = await super.bootstrap(appType);

        if (!isFunction(app.getHttpServer) || !isFunction(app.use) || !isFunction(app.getServer) || !isFunction(app.setup)) {
            throw new Error('configuration bootstrap or bootstrap with module is not right application implements IApplication.');
        }
        let cfg: IConfiguration = await this.getConfiguration() as IConfiguration;
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
            console.log('app module configure:', cfg);
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

        // custom use.
        if (this.middlewares) {
            await this.builder.loadModule(container, ...this.middlewares.filter(m => isClass(m)) as Type<any>[]);
        }

        // custom config.
        if (config.middlewares) {
            let modules = await this.builder.loadModule(container, {
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
            let controllers = await this.builder.loadModule(container, {
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
            let aops = await this.builder.loadModule(container, {
                basePath: config.rootdir,
                files: config.aop
            });

            config.usedAops = aops;
        }

        let servers = await this.builder.loadModule(container, ...this.beforeSMdls.concat(this.afterSMdls).filter(m => isClass(m)) as Type<any>[]);
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
