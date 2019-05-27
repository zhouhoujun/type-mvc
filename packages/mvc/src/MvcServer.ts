import { ContainerToken, IContainer } from '@tsdi/core';
import { IConfiguration } from './IConfiguration';
import { Inject, Injectable } from '@tsdi/ioc';
import { ILoggerManager, ILogger, IConfigureLoggerManager, ConfigureLoggerManger, LogConfigureToken } from '@tsdi/logs';
import { Router } from './router';
import { Service, ConfigureMgrToken } from '@tsdi/boot';
import * as Koa from 'koa';
import { MvcMiddlewares } from './middlewares';
import { MvcContext } from './MvcContext';

/**
 * base mvc server.
 *
 * @export
 * @abstract
 * @class MvcServer
 * @implements {IMvcServer}
 */
@Injectable()
export class MvcServer extends Service<Koa> {

    @Inject(ContainerToken)
    container: IContainer;

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

    async init() {
        let container = this.getContainer();
        let ctx = this.getMvcContext();
        this.config = await container.get(ConfigureMgrToken).getConfig();
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
        if (config.hostname) {
            this.getHttpServer().listen(port, config.hostname, listener);
        } else {
            this.getHttpServer().listen(port, listener);
        }
        console.log('service listen on port: ', port);
    }

    async stop() {
        let httpServer = this.getHttpServer();
        if (httpServer) {
            httpServer.removeAllListeners();
            httpServer.close();
        }
    }
}
