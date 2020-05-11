import { Inject, Injectable, Refs, isDefined } from '@tsdi/ioc';
import { Service, Startup } from '@tsdi/boot';
import { IConfiguration } from './IConfiguration';
import { IMvcServer } from './IMvcServer';
import { MvcContext } from './MvcContext';
import { Router } from './router/Router';
import * as https from 'https';
import * as Koa from 'koa';
import { ILogger } from '@tsdi/logs';


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

    private logger: ILogger;
    /**
     * configure startup service.
     *
     * @param {IBootContext} [ctx]
     * @returns {(Promise<void>)}
     * @memberof IStartup
     */
    async configureService(ctx: MvcContext): Promise<void> {
        this.context = ctx;
        let config = ctx.getConfiguration();
        this.logger = ctx.getLogManager().getLogger();
        this.port = config.port || parseInt(process.env.PORT || '0');
        this.hostname = config.hostname;
        this.uri = `${ctx.httpServer instanceof https.Server ? 'https' : 'http'}://${this.hostname || '127.0.0.1'}:${this.port}`;
        if (isDefined(process)) {
            process.once('beforeExit', () => {
                ctx.destroy();
            })
        }
    }

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
        let server = this.getHttpServer();
        if (this.hostname) {
            server.listen(this.port, this.hostname, listener);
        } else {
            server.listen(this.port, listener);
        }
        this.logger.info('mvc service start: ', this.uri);
    }

    async stop() {
        let httpServer = this.getHttpServer();
        if (httpServer) {
            this.logger.info('close mvc http(s) service');
            httpServer.removeAllListeners();
            httpServer.close();
        }
    }
}
