import { Singleton, IContainer, Inject, ContainerToken, isToken, Token, isFunction } from '@ts-ioc/core';
import * as http from 'http';
import * as https from 'https';
import { IConfiguration, ConfigurationToken } from './IConfiguration';
import { ILogger, ILoggerManager, IConfigureLoggerManager, ConfigureLoggerManagerToken } from '@ts-ioc/logs';
import { IMiddleware } from './middlewares';
import { IApplication, IServer, CoreServerToken } from './IApplication';
import { IRouter } from './router';

/**
 * Application of type mvc.
 *
 * @export
 * @class Application
 * @extends {Koa}
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


    setupRoutes(config: IConfiguration) {
        let router: IRouter = this.container.get(config.routerMiddlewate || RouterMiddlewareToken);
        router.register(...config.useControllers);
        router.setup();
    }

    setupMiddlewares(middlewares: Token<IMiddleware>[], filter?: (token: Token<IMiddleware>) => boolean) {
        if (!middlewares || middlewares.length < 1) {
            return;
        }
        let server = this.getServer();
        middlewares.forEach(m => {
            if (!m) {
                return;
            }
            if (filter && !filter(m)) {
                return;
            }
            if (isToken(m)) {
                let middleware = this.container.get(m);
                if (isFunction(middleware.setup)) {
                    middleware.setup();
                }
            } else if (isFunction(m)) {
                server.use(m);
            }

        });
    }

    protected getExcludeMiddwares(cfg: IConfiguration): Token<any>[] {
        return cfg.excludeMiddlewares || [];
    }

}
