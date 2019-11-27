import { Inject, Injectable, Refs } from '@tsdi/ioc';
import { Service, ServiceInit, Startup } from '@tsdi/boot';
import { IConfiguration } from './IConfiguration';
import { MvcContext } from './MvcContext';
import { Router } from './router';
import * as https from 'https';
import * as Koa from 'koa';


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


    getConfig(): IConfiguration {
        return this.context.configuration;
    }

    getRouter(): Router {
        return this.router;
    }

    async onInit() {
        let config = this.context.configuration;
        this.port = config.port || parseInt(process.env.PORT || '0');
        this.hostname = config.hostname;
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
