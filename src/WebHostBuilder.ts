import * as Koa from 'koa';
import { existsSync } from 'fs';
import { Middleware, Request, Response, Context } from 'koa';
import { MvcContext } from './MvcContext';
import { Configuration } from './Configuration';
import { Defer, createDefer, MvcMiddleware, AsyncMiddleware, MiddlewareFactory } from './util';
import { IContainer, ContainerBuilder, LoadOptions, IContainerBuilder } from 'type-autofac';
import * as path from 'path';

const serveStatic = require('koa-static');
const convert = require('koa-convert');


/**
 * WebHostBuilder
 *
 * @export
 * @class WebHostBuilder
 */
export class WebHostBuilder {
    private startup: Defer<Koa>;
    private container: Defer<IContainer>;
    private middlewares: MvcMiddleware[];
    private configuration: Defer<Configuration>;
    private builder: IContainerBuilder;
    /**
     * Creates an instance of WebHostBuilder.
     * @param rootdir
     * @param [app]
     */
    constructor(private rootdir: string, protected app?: Koa) {
        this.middlewares = [this.createMvcMiddleware()];
        this.configuration = createDefer<Configuration>();
        this.app = this.app || new Koa();
    }

    /**
     * user custom IContainer.
     *
     * @param {(IContainer | Promise<IContainer>)} [container]
     * @returns
     *
     * @memberOf WebHostBuilder
     */
    useContainer(container?: IContainer | Promise<IContainer>) {
        if (!this.container) {
            this.container = createDefer<IContainer>();
        }

        this.container.resolve(container || this.createContainer());
        return this;
    }

    getContainer() {
        if (!this.container) {
            this.useContainer();
        }
        return this.container.promise;
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

    createContainer(option?: LoadOptions): Promise<IContainer> {
        return this.getContainerBuilder().build(option);
    }


    /**
     * use custom configuration.
     *
     * @param {(string | Configuration)} [config]
     * @returns {WebHostBuilder}
     *
     * @memberOf WebHostBuilder
     */
    useConfiguration(config?: string | Configuration): WebHostBuilder {
        let excfg: Configuration;
        if (typeof config === 'string') {
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

    get config(): Promise<Configuration> {
        return this.configuration.promise;
    }

    /**
     * use middleware `fn` or  `MiddlewareFactory`.
     * @param {MvcMiddleware} middleware
     * @returns {WebHostBuilder}
     * @memberOf WebHostBuilder
     */
    use(middleware: MvcMiddleware): WebHostBuilder {
        this.middlewares.push(middleware);
        return this;
    }

    /**
     * user static files.
     *
     * @param {(string | string[])} paths
     * @returns {WebHostBuilder}
     *
     * @memberOf WebHostBuilder
     */
    useStatic(paths: string | string[]): WebHostBuilder {
        let ps = (typeof paths === 'string') ? [paths] : paths;
        ps.forEach(p => {
            let mid = convert(serveStatic(path.join(this.rootdir, p))) as Middleware;
            this.middlewares.push(mid);
        });

        return this;
    }

    /**
     * build application.
     * @returns {WebHostBuilder}
     * @memberOf WebHostBuilder
     */
    build(): WebHostBuilder {
        this.startup = createDefer<Koa>();
        this.useConfiguration();
        let cfg: Configuration;
        let container: IContainer;
        Promise.all([this.config, this.getContainer()])
            .then(data => {
                cfg = data[0];
                container = data[1];
                return this.initIContainer(cfg, container);
            })
            .then(() => this.setupMiddwares(cfg, container))
            .then(() => this.loadController(cfg, container))
            .then(this.startup.resolve)
            .catch(this.startup.reject);

        return this;
    }

    /**
     * run service.
     * @returns {Koa}
     * @memberOf WebHostBuilder
     */
    async run() {
        if (!this.startup) {
            this.build();
        }
        let app = await this.startup.promise;
        let config = await this.configuration.promise;
        app.listen(config.port || this.app.env['port']);
        return app;
    }

    /**
     * create mvc middleware.
     */
    protected createMvcMiddleware() {
        return async (ctx: MvcContext, next) => {
            ctx.container = await this.container.promise;
            await next();
        }
    }

    protected async initIContainer(config: Configuration, container: IContainer): Promise<IContainer> {
        container.registerSingleton(Configuration, config);
        return container;
    }

    protected async loadController(config: Configuration, container: IContainer): Promise<Koa> {
        return this.app;
    }

    protected async setupMiddwares(config: Configuration, container: IContainer): Promise<Koa> {
        let middlewares = await Promise.all(this.middlewares.map(m => {
            if (m &&  typeof m['createMiddleware'] === 'function') {
                return Promise.resolve(m['createMiddleware'](config, container) as AsyncMiddleware)
            } else {
                return Promise.resolve(m as AsyncMiddleware)
            }
        }));
        middlewares.forEach(m => {
            this.app.use(m);
        });
        return this.app;
    }
}
