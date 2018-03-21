import { existsSync } from 'fs';
import { Middleware, Request, Response, Context } from 'koa';
import { IConfiguration } from './IConfiguration';
import { Configuration } from './Configuration';
import { Defer, mvcSymbols } from './util/index';
import { isString, isSymbol, symbols, IContainer, ContainerBuilder, LoadOptions, IContainerBuilder, isClass, isFunction, Type, Token, toAbsolutePath } from 'tsioc';
import * as path from 'path';
import { Application, IContext, IMiddleware, registerDefaults, registerDefaultMiddlewars, Router, IRoute, IRouter } from './core';
import { execFileSync } from 'child_process';
import * as http from 'http';
// import * as http2 from 'http2';
import * as https from 'https';

// import * as logs from './logs/index';

import { AuthAspect, DebugLogAspect } from './aop/index';
import { Log4jsAdapter } from './logAdapter/Log4jsAdapter';

/**
 * Bootstrap
 *
 * @export
 * @class Bootstrap
 */
export class Bootstrap {

    private container: Defer<IContainer>;
    private middlewares: Token<any>[];
    private configDefer: Defer<IConfiguration>;
    private builder: IContainerBuilder;
    /**
     * Creates an instance of WebApplication.
     * @param {string} rootdir
     * @param {Type<any>} [appType]
     * @memberof WebApplication
     */
    constructor(private rootdir: string, protected appType?: Type<Application>) {
        this.middlewares = [];
        this.appType = this.appType || Application;
    }

    /**
     * create new application.
     *
     * @static
     * @param {string} rootdir
     * @param {Type<Application>} [appType]
     * @returns
     * @memberof WebApplication
     */
    static create(rootdir: string, appType?: Type<Application>) {
        return new Bootstrap(rootdir, appType);
    }

    /**
     * user custom IContainer.
     *
     * @param {(IContainer | Promise<IContainer>)} [container]
     * @returns
     *
     * @memberOf WebHostBuilder
     */
    useContainer(container: IContainer | Promise<IContainer>) {
        if (container) {
            if (!this.container) {
                this.container = Defer.create<IContainer>();
            }
            this.container.resolve(container);
        }
        return this;
    }

    getContainer() {
        if (!this.container) {
            this.useContainer(this.createContainer());
        }
        return this.container.promise;
    }

    protected createContainer(option?: LoadOptions): Promise<IContainer> {
        return this.getContainerBuilder().build(option);
    }



    useContainerBuilder(builder: IContainerBuilder) {
        this.builder = builder;
        return this;
    }

    getContainerBuilder() {
        if (!this.builder) {
            this.builder = new ContainerBuilder();
        }
        return this.builder;
    }




    /**
     * use custom configuration.
     *
     * @param {(string | IConfiguration)} [config]
     * @returns {Bootstrap}
     *
     * @memberOf WebHostBuilder
     */
    useConfiguration(config?: string | IConfiguration): Bootstrap {
        if (!this.configDefer) {
            this.configDefer = Defer.create<IConfiguration>();
            this.configDefer.resolve(new Configuration());
        }
        let cfgmodeles: IConfiguration;
        if (isString(config)) {
            if (existsSync(config)) {
                cfgmodeles = require(config) as IConfiguration;
            } else if (execFileSync(path.join(this.rootdir, config))) {
                cfgmodeles = require(path.join(this.rootdir, config)) as IConfiguration;
            } else {
                console.log(`config file: ${config} not exists.`)
            }
        } else if (config) {
            cfgmodeles = config;
        } else {
            let cfgpath = path.join(this.rootdir, './config');
            ['.js', '.ts', '.json'].forEach(ext => {
                if (cfgmodeles) {
                    return false;
                }
                if (existsSync(cfgpath + ext)) {
                    cfgmodeles = require(cfgpath + ext);
                    return false;
                }
                return true;
            });
            if (!cfgmodeles) {
                console.log('your app has not config file.');
            }
        }

        if (cfgmodeles) {
            let excfg = (cfgmodeles['default'] ? cfgmodeles['default'] : cfgmodeles) as IConfiguration;
            this.configDefer.promise = this.configDefer.promise
                .then(cfg => {
                    cfg = Object.assign(cfg || {}, excfg || {});
                    return cfg;
                });
        }

        return this;
    }

    getConfiguration(): Promise<IConfiguration> {
        if (!this.configDefer) {
            this.useConfiguration();
        }
        return this.configDefer.promise;
    }

    /**
     * use middleware `fn` or  `MiddlewareFactory`.
     * @param {MvcMiddleware} middleware
     * @returns {Bootstrap}
     * @memberOf WebHostBuilder
     */
    use(middleware: IMiddleware | Middleware | Token<any>): Bootstrap {
        this.middlewares.push(middleware as Type<any>);
        return this;
    }

    /**
     * run service.
     *
     * @param {Function} [listener]
     * @returns
     * @memberof Bootstrap
     */
    async run(listener?: Function) {
        let app = await this.build();
        let config = app.container.get<IConfiguration>(mvcSymbols.IConfiguration);
        let server = app.getServer();
        let port = config.port || parseInt(process.env.PORT || '0');
        if (config.hostname) {
            server.listen(port, config.hostname, listener);
        } else {
            server.listen(port, listener);
        }

        console.log('service listen on port: ', port);
        return app;
    }


    /**
     * build application.
     * @returns {Bootstrap}
     * @memberOf WebHostBuilder
     */
    protected async build(): Promise<Application> {
        let cfg: IConfiguration = await this.getConfiguration();
        let container: IContainer = await this.getContainer();
        await this.initIContainer(cfg, container);
        let app = container.get(this.appType);
        this.setupMiddwares(app, container, cfg.beforeMiddlewares, cfg.excludeMiddlewares);
        this.setupMiddwares(app, container, cfg.useMiddlewares, cfg.excludeMiddlewares.concat(cfg.afterMiddlewares));
        this.setupRoutes(cfg, container);
        this.setupMiddwares(app, container, cfg.afterMiddlewares, cfg.excludeMiddlewares);
        return app;
    }


    protected async initIContainer(config: IConfiguration, container: IContainer): Promise<IContainer> {
        config.rootdir = config.rootdir ? toAbsolutePath(this.rootdir, config.rootdir) : this.rootdir;
        container.registerSingleton(mvcSymbols.IConfiguration, config);
        this.registerDefaults(container);
        // register app.
        container.register(this.appType);

        // custom use.
        if (this.middlewares) {
            await this.builder.loadModule(container, {
                modules: this.middlewares.filter(m => isClass(m)) as Type<any>[]
            });
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
            container.registerSingleton(symbols.LogConfigure, config.logConfig);
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
    protected setupMiddwares(app: Application, container: IContainer, middlewares: Token<any>[], excludes: Token<any>[]) {
        middlewares.forEach(m => {
            if (!m) {
                return;
            }
            if (excludes && excludes.length > 0 && excludes.indexOf(m) > 0) {
                return;
            }
            if (isClass(m) || isString(m) || isSymbol(m)) {
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

}
