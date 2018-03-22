import * as Koa from 'koa';
import { Injectable, Singleton, IContainer, AutoWired, Inject, symbols, Type } from 'tsioc';
import { mvcSymbols } from '../util/index';
import * as http from 'http';
// import * as http2 from 'http2';
import * as https from 'https';
import { IConfiguration } from '../IConfiguration';
/**
 * Application of type mvc.
 *
 * @export
 * @class Application
 * @extends {Koa}
 */
@Singleton
export class Application {

    private server: http.Server | https.Server;
    private koa: Koa;

    constructor() {
    }

    getKoa(): Koa {
        if (!this.koa) {
            this.koa = new Koa();
        }
        return this.koa;
    }

    getServer() {
        if (!this.server) {
            let cfg = this.container.get<IConfiguration>(mvcSymbols.IConfiguration);
            if (cfg.httpsOptions) {
                this.server = https.createServer(cfg.httpsOptions, this.getKoa().callback);
            } else {
                this.server = http.createServer(this.getKoa().callback());
            }
        }
        return this.server;
    }

    use(middleware: Koa.Middleware) {
        this.getKoa().use(middleware);
    }

    @Inject(symbols.IContainer)
    container: IContainer;

}
