import { existsSync } from 'fs';
import { Middleware, Request, Response, Context } from 'koa';
import { IConfiguration, Configuration } from './Configuration';
import { Defer, symbols } from './util';
import { IContainer, ContainerBuilder, LoadOptions, IContainerBuilder, isClass, isFunction, Type, Token, toAbsolutePath } from 'tsioc';
import * as path from 'path';
import { isString, isSymbol } from 'util';
import { Application, IContext, IMiddleware, registerDefaults, registerDefaultMiddlewars, Router, IRoute, IRouter } from './core';
import { execFileSync } from 'child_process';


/**
 * Bootstrap
 *
 * @export
 * @class Bootstrap
 */
export class Bootstrap {

    private container: Defer<IContainer>;
    private middlewares: Token<any>[];
    private configDefer: Defer<Configuration>;
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
            this.configDefer = Defer.create<Configuration>();
            this.configDefer.resolve(new Configuration());
        }
        let excfg: IConfiguration;
        if (isString(config)) {
            if (existsSync(config)) {
                excfg = require(config) as IConfiguration;
            } else if (execFileSync(path.join(this.rootdir, config))) {
                excfg = require(path.join(this.rootdir, config)) as IConfiguration;
            } else {
                console.log(`config file: ${config} not exists.`)
            }
        } else if (config) {
            excfg = config;
        } else {
            let cfgpath = path.join(this.rootdir, './config');
            let config: IConfiguration;
            ['.js', '.json'].forEach(ext => {
                if (config) {
                    return false;
                }
                if (existsSync(cfgpath + ext)) {
                    config = require(cfgpath + ext) as IConfiguration;
                    return false;
                }
                return true;
            });
            if (!config) {
                console.log('your app has not config file.');
            }
            excfg = config;
        }

        if (excfg) {
            this.configDefer.promise = this.configDefer.promise
                .then(cfg => {
                    cfg = Object.assign(cfg || {}, excfg || {});
                    return cfg;
                });
        }

        return this;
    }

    getConfiguration(): Promise<Configuration> {
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
     * @returns {Application}
     * @memberOf WebHostBuilder
     */
    async run() {
        let app = await this.build();
        let config = app.container.get(Configuration);
        app.getServer().listen(config.port || process.env.PORT);
        console.log('service listen on port: ', config.port);
        return app;
    }


    /**
     * build application.
     * @returns {Bootstrap}
     * @memberOf WebHostBuilder
     */
    protected async build(): Promise<Application> {
        let cfg: Configuration = await this.getConfiguration();
        let container: IContainer = await this.getContainer();
        await this.initIContainer(cfg, container);
        let app = container.get(this.appType);
        this.setupMiddwares(app, container, cfg.beforeMiddlewares, cfg.excludeMiddlewares);
        this.setupMiddwares(app, container, cfg.useMiddlewares, cfg.excludeMiddlewares.concat(cfg.afterMiddlewares));
        this.setupRoutes(cfg, container);
        this.setupMiddwares(app, container, cfg.afterMiddlewares, cfg.excludeMiddlewares);
        return app;
    }


    protected async initIContainer(config: Configuration, container: IContainer): Promise<IContainer> {
        config.rootdir = config.rootdir ? toAbsolutePath(this.rootdir, config.rootdir) : this.rootdir;
        container.registerSingleton(Configuration, config);
        container.registerSingleton(symbols.IConfiguration, config);
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
                if (middleware.setup) {
                    middleware.setup();
                }

            } else if (isFunction(m)) {
                app.use(m as Middleware);
            }

        });
        return app;
    }

}
