import { IConfiguration } from './IConfiguration';
import { Inject, Injectable, Refs } from '@tsdi/ioc';
import { Router } from './router';
import { Service, ServiceInit, Runnable, Startup } from '@tsdi/boot';
import * as Koa from 'koa';
import { MvcContext } from './MvcContext';
import * as https from 'https';


/**
 * base mvc server.
 *
 * @export
 * @abstract
 * @class MvcServer
 * @implements {IMvcServer}
 */
@Injectable()
@Refs('@MvcModule', Startup)
export class MvcServer extends Service<Koa, MvcContext> implements ServiceInit {

    uri: string;
    port: number;
    hostname: string;

    @Inject()
    protected router: Router;


    protected config: IConfiguration;

    getConfig(): IConfiguration {
        return this.config;
    }

    getRouter(): Router {
        return this.router;
    }

    async onInit() {
        this.config = this.context.configuration;
        this.port = this.config.port || parseInt(process.env.PORT || '0');
        this.hostname = this.config.hostname;
        this.uri = `${this.context.httpServer instanceof https.Server ? 'https' : 'http'}://${this.hostname || '127.0.0.1'}:${this.port}`;
    }

    getHttpServer() {
        return this.context.httpServer;
    }

    async start() {
        let ctx = this.context;
        let listener = ctx.listener;
        let server = this.getHttpServer();
        if (this.hostname) {
            server.listen(this.port, this.hostname, listener);
        } else {
            server.listen(this.port, listener);
        }
        console.log('service start: ', this.uri);
    }

    async stop() {
        let httpServer = this.getHttpServer();
        if (httpServer) {
            httpServer.removeAllListeners();
            httpServer.close();
        }
    }
}
