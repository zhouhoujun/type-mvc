import { existsSync } from 'fs';
import { Middleware, Request, Response, Context } from 'koa';
import { IConfiguration, ConfigurationToken } from './IConfiguration';
import { Configuration } from './Configuration';
import { isString, isSymbol, IContainer, IContainerBuilder, isClass, isFunction, Type, Token, isToken, Defer, LoadType, IModuleBuilder, hasClassMetadata, getTypeMetadata } from '@ts-ioc/core';
import { ContainerBuilder, toAbsolutePath, PlatformServer, AppConfigurationToken } from '@ts-ioc/platform-server';
import * as path from 'path';
import { IApplication, Application, IContext, IMiddleware, registerDefaults, registerDefaultMiddlewars, Router, IRoute, IRouter, ApplicationToken, AppModule } from './core/index';
import * as http from 'http';
// import * as http2 from 'http2';
import * as https from 'https';


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
export class Bootstrap extends PlatformServer<IConfiguration> implements IModuleBuilder<IConfiguration> {

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
    async run<T extends IApplication>(appModule?: Type<any>): Promise<T> {
        return this.bootstrap<T>(appModule);
    }

    /**
     * bootstrap mvc application with App Module.
     *
     * @template T
     * @param {Type<T>} [appModule]
     * @returns {Promise<T>}
     * @memberof Bootstrap
     */
    async bootstrap<T extends IApplication>(appModule?: Type<any>): Promise<T> {
        let appType = appModule || Application;
        let app: IApplication = await super.bootstrap(appType);

        if (!isFunction(app.getServer) || !isFunction(app.use) || !isFunction(app.getKoa)) {
            console.error('configuration bootstrap or bootstrap with module is not right application implements IApplication.');
        }
        let cfg: IConfiguration = await this.getConfiguration();
        let container = await this.getContainer();
        this.setupServerMiddwares(app, container, this.beforeSMdls);

        this.setupMiddwares(app, container, cfg.beforeMiddlewares, cfg.excludeMiddlewares);
        this.setupMiddwares(app, container, cfg.useMiddlewares, cfg.excludeMiddlewares.concat(cfg.afterMiddlewares));
        this.setupRoutes(cfg, container);
        this.setupMiddwares(app, container, cfg.afterMiddlewares, cfg.excludeMiddlewares);

        this.setupServerMiddwares(app, container, this.afterSMdls);


        let config = container.get(ConfigurationToken);
        let server = app.getServer();
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

    protected getMetaConfig(appModule: Type<any>): IConfiguration {
        let cfg: IConfiguration;
        if (hasClassMetadata(AppModule, appModule)) {
            let meta = getTypeMetadata<IConfiguration>(AppModule, appModule);
            if (meta && meta.length) {
                console.log('bootstrap with applction module with metadata:\n', meta[0]);
                return meta[0];
            }
        }
        return super.getMetaConfig(appModule);
    }

    protected async initContainer(config: IConfiguration, container: IContainer): Promise<IContainer> {

        if (!container.has(AopModule)) {
            container.register(AopModule);
        }
        if (!container.has(LogModule)) {
            container.register(LogModule);
        }

        await super.initContainer(config, container);


        container.registerSingleton(ConfigurationToken, config);
        container.registerSingleton(Configuration, config as Configuration);

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
        // register default
        this.registerDefaultMiddlewars(container);

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


    protected registerDefaultMiddlewars(container: IContainer) {
        registerDefaultMiddlewars(container);
    }

    protected registerDefaults(container: IContainer) {
        registerDefaults(container);
        container.register(Log4jsAdapter);
    }

    protected setupRoutes(config: IConfiguration, container: IContainer) {
        let router: IRouter = container.get(config.routerMiddlewate || Router);
        router.register(...config.useControllers);
        router.setup();
    }

    protected setupMiddwares(app: IApplication, container: IContainer, middlewares: Token<any>[], excludes: Token<any>[]) {
        if (!middlewares || middlewares.length < 1) {
            return app;
        }
        middlewares.forEach(m => {
            if (!m) {
                return;
            }
            if (excludes && excludes.length > 0 && excludes.indexOf(m) > 0) {
                return;
            }
            if (isToken(m)) {
                let middleware = container.get(m as Token<any>) as IMiddleware;
                if (isFunction(middleware.setup)) {
                    middleware.setup();
                }

            } else if (isFunction(m)) {
                app.use(m as Middleware);
            }

        });
        return app;
    }

    protected setupServerMiddwares(app: IApplication, container: IContainer, middlewares: (ServerMiddleware | Token<IServerMiddleware>)[]) {
        if (!middlewares || middlewares.length < 1) {
            return;
        }
        middlewares.forEach(m => {
            if (!m) {
                return;
            }

            if (isToken(m)) {
                let middleware = container.get(m as Token<any>) as IServerMiddleware;
                if (isFunction(middleware.setup)) {
                    middleware.setup();
                }

            } else if (isFunction(m)) {
                m(app, container);
            }

        })
    }
}
