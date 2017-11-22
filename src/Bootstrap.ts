import { existsSync } from 'fs';
import { Middleware, Request, Response, Context } from 'koa';
import { MvcContext } from './MvcContext';
import { Configuration } from './Configuration';
import { Defer } from './util';
import { IContainer, ContainerBuilder, LoadOptions, IContainerBuilder, isClass, isFunction, Type, Token } from 'type-autofac';
import * as path from 'path';
import { isString, isSymbol } from 'util';
import { IMiddleware } from './middlewares';
import { Application } from './Application';
import { ContextMiddleware } from './middlewares/ContextMiddleware';
import { MvcRouter } from './router';

// const serveStatic = require('koa-static');
// const convert = require('koa-convert');


/**
 * Bootstrap
 *
 * @export
 * @class Bootstrap
 */
export class Bootstrap {

    private container: Defer<IContainer>;
    private middlewares: Token<any>[];
    private configuration: Defer<Configuration>;
    private builder: IContainerBuilder;
    /**
     * Creates an instance of WebApplication.
     * @param {string} rootdir
     * @param {Type<any>} [appType]
     * @memberof WebApplication
     */
    constructor(private rootdir: string, protected appType?: Type<Application>) {
        this.middlewares = [
            ContextMiddleware,
            MvcRouter
        ];
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
     * @param {(string | Configuration)} [config]
     * @returns {Bootstrap}
     *
     * @memberOf WebHostBuilder
     */
    useConfiguration(config?: string | Configuration): Bootstrap {
        this.configuration = Defer.create<Configuration>();
        let excfg: Configuration;
        if (isString(config)) {
            if (existsSync(config)) {
                excfg = require(config) as Configuration;
            } else {
                console.log(`config file: ${config} not exists.`)
            }
        } else if (config) {
            excfg = config;
        } else {
            let cfgpath = path.join(this.rootdir, './config');
            let config: Configuration;
            ['.js', '.json'].forEach(ext => {
                if (config) {
                    return false;
                }
                if (existsSync(cfgpath + ext)) {
                    config = require(cfgpath + ext) as Configuration;
                    return false;
                }
                return true;
            });
            if (!config) {
                config = {};
                console.log('your app has not config file.');
            }
            this.configuration.resolve(Object.assign(new Configuration(), config));
        }

        if (excfg) {
            this.configuration.promise = this.configuration.promise
                .then(cfg => {
                    cfg = Object.assign(cfg || {}, excfg || {});
                    return cfg;
                });
        }

        return this;
    }

    getConfiguration(): Promise<Configuration> {
        if (!this.configuration) {
            this.useConfiguration();
        }
        return this.configuration.promise;
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

    // /**
    //  * user static files.
    //  *
    //  * @param {(string | string[])} paths
    //  * @returns {Bootstrap}
    //  *
    //  * @memberOf WebHostBuilder
    //  */
    // useStatic(paths: string | string[]): Bootstrap {
    //     let ps = isString(paths) ? [paths] : paths;
    //     ps.forEach(p => {
    //         let mid = convert(serveStatic(path.join(this.rootdir, p))) as Middleware;
    //         this.middlewares.push(mid);
    //     });

    //     return this;
    // }

    /**
     * build application.
     * @returns {Bootstrap}
     * @memberOf WebHostBuilder
     */
    protected build(): Promise<Application> {
        let cfg: Configuration;
        let container: IContainer;
        return Promise.all([this.getConfiguration(), this.getContainer()])
            .then(data => {
                cfg = data[0];
                container = data[1];
                return this.initIContainer(cfg, container);
            })
            .then(() => this.setupMiddwares(cfg, container))
            .then(() => this.setupRoutes(cfg, container))
            .then(() => container.get(this.appType));

    }

    /**
     * run service.
     * @returns {Application}
     * @memberOf WebHostBuilder
     */
    async run() {
        let app = await this.build();
        let config = await this.configuration.promise;
        app.listen(config.port || app.env['port']);
        return app;
    }


    protected async initIContainer(config: Configuration, container: IContainer): Promise<IContainer> {
        container.registerSingleton(Configuration, config);
        // register self.
        container.register('IContainer', () => container);
        container.register(this.appType);
        if (this.middlewares) {
            await this.builder.loadModule(container, {
                modules: this.middlewares.filter(m => isClass(m)) as Type<any>[]
            });
        }
        if (config.middlewares) {
            let modules = await this.builder.loadModule(container, {
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
                files: config.controllers
            });
            if (!config.useControllers || config.useControllers.length < 1) {
                config.useControllers = controllers;
            }
        }
        return container;
    }

    protected async setupRoutes(config: Configuration, container: IContainer) {
        container.get(MvcRouter);
        config.useControllers
        return;
    }

    protected async setupMiddwares(config: Configuration, container: IContainer): Promise<Application> {
        let app = container.get(this.appType);
        await Promise.all(config.useMiddlewares.map(m => {
            if (!m) {
                return null;
            }
            if (isClass(m) || isString(m) || isSymbol(m)) {
                let middleware = container.get(m as Token<any>) as IMiddleware;
                if (middleware.setup) {
                    middleware.setup();
                }
                return middleware;
            } else if (isFunction(m)) {
                app.use(m as Middleware);
                return m;
            }
            return null;
        }));

        return app;
    }
}
