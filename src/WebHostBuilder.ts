import * as Koa from 'koa';
import { existsSync } from 'fs';
import { Middleware, Request, Response, Context } from 'koa';
import { Configuration } from './Configuration';
const convert = require('koa-convert');

// const views = require('koa-views');
// import { IMap } from './util/type';

/**
 * WebHostBuilder
 * 
 * @export
 * @class WebHostBuilder
 */
export class WebHostBuilder {
    private startup: Promise<Koa>;
    private resolve: (value?: Koa | PromiseLike<Koa>) => void;
    private reject: (reason?) => void;
    private middlewares: Middleware[];
    private configuration: Configuration;
    /**
     * Creates an instance of WebHostBuilder.
     * @param {Koa} [app] 
     * 
     * @memberOf WebHostBuilder
     */
    constructor(protected app?: Koa) {
        this.middlewares = [];
        this.startup = new Promise<Koa>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.app = this.app || new Koa();
    }


    /**
     * use custom configuration.
     * 
     * @param {(string | Configuration)} config 
     * 
     * @memberOf WebHostBuilder
     */
    useConfiguration(config: string | Configuration) {
        if (typeof config === 'string') {
            if (existsSync(config)) {
                this.configuration = require(config) as Configuration;
            } else {
                console.log(`config file: ${config} not exists.`)
            }
        } else {
            this.configuration = config;
        }
    }

    /**
     * use middleware.
     * 
     * @param {Koa.Middleware} middleware 
     * @returns {WebHostBuilder} 
     * 
     * @memberOf WebHostBuilder
     */
    use(name: string, middleware: Koa.Middleware): WebHostBuilder {
        this.middlewares.push(middleware);
        return this;
    }

    /**
     * build application.
     * 
     * @returns {WebHostBuilder} 
     * 
     * @memberOf WebHostBuilder
     */
    build(): WebHostBuilder {
        this.setupMiddwares(this.middlewares);
        this.resolve(this.app);
        return this;
    }

    /**
     * run service.
     * 
     * @returns {Koa} 
     * 
     * @memberOf WebHostBuilder
     */
    run(): Koa {
        this.startup.then((app) => {
            app.listen(this.app.env['port'])
        });
        return this.app;
    }


    protected mapRoute() {

    }

    protected setupMiddwares(middlewares: Middleware[]) {
        middlewares.forEach(m => {
            this.app.use(convert(m));
        });
    }
}
