import * as Koa from 'koa';
import { Injectable, Singleton, IContainer, AutoWired, Inject, symbols as iocSymbols, Type } from 'tsioc';
import { symbols } from './util';
import * as http from 'http';
// import * as http2 from 'http2';
import * as https from 'https';
import { IConfiguration } from './Configuration';
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
            let cfg = this.container.get<IConfiguration>(symbols.IConfiguration);
            if (cfg.httpsOptions) {
                this.server = https.createServer(cfg.httpsOptions, this.koa.callback);
            } else {
                this.server = http.createServer(this.koa.callback());
            }
        }
        return this.server;
    }

    use(middleware: Koa.Middleware) {
        this.getKoa().use(middleware);
    }

    @Inject(iocSymbols.IContainer)
    container: IContainer;

}
