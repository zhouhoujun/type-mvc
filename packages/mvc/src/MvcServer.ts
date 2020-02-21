import { Inject, Injectable, Refs } from '@tsdi/ioc';
import { Service, Startup } from '@tsdi/boot';
import { IConfiguration } from './IConfiguration';
import { IMvcServer } from './IMvcServer';
import { MvcContext } from './MvcContext';
import { Router } from './router/Router';
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
export class MvcServer extends Service<Koa> implements IMvcServer {

    uri: string;
    port: number;
    hostname: string;

    @Inject()
    protected router: Router;

    getContext(): MvcContext {
        return this.context as MvcContext;
    }


    getConfig(): IConfiguration {
        return this.context.getConfiguration();
    }

    getRouter(): Router {
        return this.router;
    }

    getHttpServer() {
        return this.getContext().httpServer;
    }

    async start() {
        let ctx = this.getContext();
        let listener = ctx.listener;
        let config = ctx.getConfiguration();
        this.port = config.port || parseInt(process.env.PORT || '0');
        this.hostname = config.hostname;
        this.uri = `${ctx.httpServer instanceof https.Server ? 'https' : 'http'}://${this.hostname || '127.0.0.1'}:${this.port}`;
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
