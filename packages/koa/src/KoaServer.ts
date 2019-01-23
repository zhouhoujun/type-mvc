import { MvcServer, MvcServerToken, IConfiguration, ServerListenerToken } from '@mvx/mvc';
import * as Koa from 'koa';
import * as http from 'http';
import * as https from 'https';
import { Injectable, isFunction } from '@ts-ioc/core';

@Injectable(MvcServerToken)
export class KoaServer extends MvcServer {

    koa: Koa;
    private httpServer: http.Server | https.Server;

    constructor() {
        super();
        console.log('koa server init');
        this.koa = new Koa();
    }
    use(middleware: any) {
        this.koa.use(middleware);
    }

    start(config: IConfiguration) {
        let listener = this.container.has(ServerListenerToken) ? this.container.get(ServerListenerToken) : null;
        let func;
        if (isFunction(listener)) {
            func = listener;
        } else if (listener) {
            let ls = listener;
            func = (...args: any[]) => ls.listener(...args);
        }

        if (!this.httpServer) {
            if (config.httpsOptions) {
                this.httpServer = https.createServer(config.httpsOptions, this.koa.callback);
            } else {
                this.httpServer = http.createServer(this.koa.callback);
            }
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
