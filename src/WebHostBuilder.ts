import * as Koa from 'koa';
import { existsSync } from 'fs';
import { Middleware, Request, Response, Context } from 'koa';
import { Configuration } from './Configuration';
import { Defer, createDefer, MvcMiddleware, AsyncMiddleware } from './util';
import { Injector } from './di';
import * as path from 'path';
import * as _ from 'lodash';

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
    private _injector: Injector;
    private middlewares: MvcMiddleware[];
    private configuration: Defer<Configuration>;

    /**
     * Creates an instance of WebHostBuilder.
     * @param rootdir
     * @param [app]
     */
    constructor(private rootdir: string, protected app?: Koa) {
        this.middlewares = [];
        this.configuration = createDefer<Configuration>();
        this.app = this.app || new Koa();
    }

    useInjector(injector: Injector) {
        this._injector = injector;
        return this;
    }


    /**
     * use custom configuration.
     * @param {(string | Configuration)} config
     * @memberOf WebHostBuilder
     */
    useConfiguration(config?: string | Configuration) {
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
            this.configuration.resolve(require(path.join(this.rootdir, './config.json')) as Configuration);
        }

        if (excfg) {
            this.configuration.promise = this.configuration.promise
                .then(cfg => {
                    cfg = _.extend({}, cfg || {}, excfg || {});
                    return cfg;
                });
        }
    }

    get injector(): Injector {
        return this._injector || Injector.instance;
    }

    get config(): Promise<Configuration> {
        return this.configuration.promise
            .then(cfg => {
                this.injector.registerSingleton('Configuration', cfg);
                return cfg;
            });
    }

    /**
     * use middleware.
     * @param {MvcMiddleware} middleware
     * @returns {WebHostBuilder}
     * @memberOf WebHostBuilder
     */
    use(middleware: MvcMiddleware): WebHostBuilder {
        this.middlewares.push(middleware);
        return this;
    }

    useStatic(paths: string | string[]) {
        let ps = (typeof paths === 'string') ? [paths] : paths;
        ps.forEach(p => {
            let mid = convert(serveStatic(path.join(this.rootdir, p))) as Middleware;
            this.middlewares.push(mid);
        });
    }

    /**
     * build application.
     * @returns {WebHostBuilder}
     * @memberOf WebHostBuilder
     */
    build(): WebHostBuilder {
        this.startup = createDefer<Koa>();
        this.useConfiguration();
        this.setupMiddwares()
            .then(this.loadController)
            .then(this.startup.resolve)
            .catch(this.startup.reject);
        return this;
    }

    /**
     * run service.
     * @returns {Koa}
     * @memberOf WebHostBuilder
     */
    async run(): Promise<Koa> {
        if (!this.startup) {
            this.build();
        }
        let app = await this.startup.promise;
        app.listen(this.app.env['port']);
        return app;
    }


    protected async loadController(): Promise<Koa> {
        return this.app;
    }

    protected async setupMiddwares(): Promise<Koa> {
        let middlewares = await Promise.all(this.middlewares.map(m => {
            if (m && m['createMiddleware']) {
                return Promise.resolve(m['createMiddleware']() as AsyncMiddleware)
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
