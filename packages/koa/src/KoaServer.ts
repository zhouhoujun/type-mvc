import { MvcServer, MvcServerToken, IConfiguration, ServerListenerToken } from '@mvx/mvc';
import * as Koa from 'koa';
import * as http from 'http';
import * as https from 'https';
import { Injectable, isFunction, lang } from '@ts-ioc/core';

@Injectable(MvcServerToken)
export class KoaServer extends MvcServer {

    koa: Koa;
    private httpServer: http.Server | https.Server;
    private config: IConfiguration;
    constructor() {
        super();
    }

    init(config: IConfiguration): void {
        this.config = config;
        this.koa = new Koa();
        if (config.httpsOptions) {
            this.httpServer = https.createServer(config.httpsOptions, this.koa.callback);
        } else {
            this.httpServer = http.createServer(this.koa.callback);
        }
    }

    getHttpServer() {
        return this.httpServer;
    }

    use(middleware: any) {
        lang.assert(this.koa, 'server has not init with config.')
        this.koa.use(middleware);
    }

    useFac(middlewareFactory: (core?: any, httpServer?: any) => any) {
        lang.assert(this.koa, 'server has not init with config.')
        let middleware = middlewareFactory(this.koa, this.httpServer);
        this.koa.use(middleware);
    }

    start() {
        let config = this.config;
        let listener = this.container.has(ServerListenerToken) ? this.container.get(ServerListenerToken) : null;
        let func;
        if (isFunction(listener)) {
            func = listener;
        } else if (listener) {
            let ls = listener;
            func = (...args: any[]) => ls.listener(...args);
        }
        let port = config.port || parseInt(process.env.PORT || '0');
        if (config.hostname) {
            this.httpServer.listen(port, config.hostname, func);
        } else {
            this.httpServer.listen(port, func);
        }
        console.log('service listen on port: ', port);
    }

    stop() {
        if (this.httpServer) {
            this.httpServer.removeAllListeners();
            this.httpServer.close();
        }
    }
}
