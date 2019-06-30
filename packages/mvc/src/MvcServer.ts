import { ContainerToken, IContainer } from '@tsdi/core';
import { IConfiguration } from './IConfiguration';
import { Inject, Injectable, Refs } from '@tsdi/ioc';
import { ILoggerManager, ILogger, IConfigureLoggerManager, ConfigureLoggerManger, LogConfigureToken } from '@tsdi/logs';
import { Router } from './router';
import { Service, ConfigureMgrToken, ServiceInit, Runnable } from '@tsdi/boot';
import * as Koa from 'koa';
import { MvcMiddlewares } from './middlewares';
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
@Refs('@MvcModule', Runnable)
export class MvcServer extends Service<Koa> implements ServiceInit {

    @Inject(ContainerToken)
    container: IContainer;

    uri: string;

    private _loggerMgr: ILoggerManager;

    @Inject()
    protected router: Router;

    @Inject(MvcMiddlewares)
    protected middlewares: MvcMiddlewares;

    protected config: IConfiguration;

    getLoggerManger(): ILoggerManager {
        if (!this._loggerMgr) {
            let cfg = this.getConfig();
            this._loggerMgr = this.container.resolve<IConfigureLoggerManager>(ConfigureLoggerManger, { provide: LogConfigureToken, useValue: cfg.logConfig })
        }
        return this._loggerMgr;
    }


    getLogger(name?: string): ILogger {
        return this.getLoggerManger().getLogger(name);
    }

    getConfig(): IConfiguration {
        return this.config;
    }

    getRouter(): Router {
        return this.router;
    }

    getMiddlewares(): MvcMiddlewares {
        return this.middlewares;
    }

    getMvcContext(): MvcContext {
        return this.context as MvcContext;
    }

    async onInit() {
        let ctx = this.getMvcContext();
        this.config = ctx.configuration || await this.container.resolve(ConfigureMgrToken).getConfig();
        this.getMiddlewares().setup(ctx);
    }

    getHttpServer() {
        return this.getMvcContext().httpServer;
    }

    async start() {
        let config = this.config;
        let ctx = this.getMvcContext();
        let listener = ctx.listener;
        let port = config.port || parseInt(process.env.PORT || '0');
        let server = this.getHttpServer();
        if (config.hostname) {
            server.listen(port, config.hostname, listener);
        } else {
            server.listen(port, listener);
        }
        this.uri = `${server instanceof https.Server ? 'https' : 'http'}://${config.hostname || '127.0.0.1'}:${port}`;
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
