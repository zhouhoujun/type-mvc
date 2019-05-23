import { IMvcServer } from './IMvcServer';
import { ContainerToken, IContainer } from '@tsdi/core';
import { IConfiguration } from './IConfiguration';
import { Abstract, Inject, Type } from '@tsdi/ioc';
import { ILoggerManager, ILogger, IConfigureLoggerManager, ConfigureLoggerManger, LogConfigureToken } from '@tsdi/logs';
import { IRouter } from './router';

/**
 * base mvc server.
 *
 * @export
 * @abstract
 * @class MvcServer
 * @implements {IMvcServer}
 */
@Abstract()
export abstract class MvcServer implements IMvcServer {

    @Inject(ContainerToken)
    container: IContainer;

    private _loggerMgr: ILoggerManager;
    protected router: IRouter;
    protected controllers: Type<any>[];
    protected middlewares: Type<any>[];
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
        return this.config as IConfiguration;
    }

    getRouter(): IRouter {
        return this.router;
    }

    getControllers(): Type<any>[] {
        return this.controllers;
    }

    getMiddlewares(): Type<any>[] {
        return this.middlewares;
    }

    constructor() {
    }

    abstract init(config: IConfiguration): void;

    abstract getHttpServer(): any;
    abstract use(middleware: any);
    abstract useFac(middlewareFactory: (core?: any, httpServer?: any) => any);
    abstract start();
    abstract stop();
}
