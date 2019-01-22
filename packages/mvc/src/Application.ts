import { Singleton, IContainer, Inject, ContainerToken, isFunction, Token } from '@ts-ioc/core';
import * as http from 'http';
import * as https from 'https';
import { IConfiguration, ConfigurationToken } from './IConfiguration';
import { ILogger, ILoggerManager, IConfigureLoggerManager, ConfigureLoggerManagerToken } from '@ts-ioc/logs';
import { IMvcServer, CoreServerToken, ApplicationToken, IApplication } from './IApplication';
import { IContext } from './IContext';
import { Next } from './util';
import { ServerListenerToken } from './IListener';
import { MiddlewareChainToken, IMiddlewareChain } from './middlewares';
import { Boot, RunOptions } from '@ts-ioc/bootstrap';

/**
 * Default Application of type mvc.
 *
 * @export
 * @class Application
 * @implements {IApplication}
 */
@Singleton(ApplicationToken)
export class Application extends Boot<IMvcServer> implements IApplication {
    name?: string;

    private httpServer: http.Server | https.Server;
    private _loggerMgr: ILoggerManager;

    @Inject(ContainerToken)
    container: IContainer;

    getConfig(): IConfiguration {
        return this.config;
    }

    @Inject(MiddlewareChainToken)
    middlewareChain: IMiddlewareChain;

    constructor(token?: Token<IMvcServer>, instance?: IMvcServer, config?: IConfiguration) {
        super(token, instance, config);
    }

    async onInit(options: RunOptions<IMvcServer>) {

    }

    getMiddleChain(): IMiddlewareChain {
        return this.container.resolve(MiddlewareChainToken);
    }

    private mvcService: IMvcServer;
    getServer(): IMvcServer {
        if (!this.mvcService) {
            this.mvcService = this.container.resolve(CoreServerToken);
        }
        return this.mvcService;
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

    async start() {
        let config = this.configuration;
        let listener = this.container.has(ServerListenerToken) ? this.container.get(ServerListenerToken) : null;
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
        console.log('service listen on port: ', port);
    }

    async stop() {
        let server = this.getHttpServer();
        server.removeAllListeners();
        server.close();
    }

}
