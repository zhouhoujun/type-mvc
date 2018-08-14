import { Singleton, IContainer, Inject, ContainerToken, isFunction } from '@ts-ioc/core';
import * as http from 'http';
import * as https from 'https';
import { IConfiguration, ConfigurationToken } from './IConfiguration';
import { ILogger, ILoggerManager, IConfigureLoggerManager, ConfigureLoggerManagerToken } from '@ts-ioc/logs';
import { IApplication, IServer, CoreServerToken } from './IApplication';
import { IContext } from './IContext';
import { Next } from './util';
import { ServerListenerToken } from './IListener';
import { MiddlewareChainToken, IMiddlewareChain } from './middlewares';

/**
 * Default Application of type mvc.
 *
 * @export
 * @class Application
 * @implements {IApplication}
 */
@Singleton
export class Application implements IApplication {

    private httpServer: http.Server | https.Server;
    private _loggerMgr: ILoggerManager;

    @Inject(ContainerToken)
    container: IContainer;

    @Inject(ConfigurationToken)
    configuration: IConfiguration;

    constructor() {

    }

    getMiddleChain(): IMiddlewareChain {
        return this.container.resolve(MiddlewareChainToken);
    }

    getServer(): IServer {
        return this.container.resolve(CoreServerToken);
    }

    getLoggerManger(): ILoggerManager {
        if (!this._loggerMgr) {
            let cfg = this.configuration;
            this._loggerMgr = this.container.resolve<IConfigureLoggerManager>(ConfigureLoggerManagerToken, { config: cfg.logConfig })
        }
        return this._loggerMgr;
    }


    getLogger(name?: string): ILogger {
        return this.getLoggerManger().getLogger(name);
    }

    getHttpServer() {
        if (!this.httpServer) {
            let cfg = this.configuration;
            if (cfg.httpsOptions) {
                this.httpServer = https.createServer(cfg.httpsOptions, this.getServer().callback());
            } else {
                this.httpServer = http.createServer(this.getServer().callback());
            }
        }
        return this.httpServer;
    }

    use(middleware: (context: IContext, next?: Next) => any) {
        this.getServer().use(middleware);
    }

    run() {
        let config = this.configuration;
        let listener = this.container.get(ServerListenerToken);
        let func;
        if (isFunction(listener)) {
            func = listener;
        } else if (listener) {
            let ls = listener;
            func = (...args: any[]) => ls.listener(...args);
        }

        let server = this.getHttpServer();
        let port = config.port || parseInt(process.env.PORT || '0');
        if (config.hostname) {
            server.listen(port, config.hostname, func);
        } else {
            server.listen(port, func);
        }
    }

}
