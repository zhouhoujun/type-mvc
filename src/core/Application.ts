import * as Koa from 'koa';
import { Injectable, Singleton, IContainer, AutoWired, Inject, symbols, Type, InjectToken } from '@ts-ioc/core';
import * as http from 'http';
// import * as http2 from 'http2';
import * as https from 'https';
import { IConfiguration } from '../IConfiguration';
import { ILogger, ILoggerManager, IConfigureLoggerManager, LogSymbols } from '@ts-ioc/logs';

/**
 * Application token.
 */
export const ApplicationToken = new InjectToken<Application>('__MVC_Application');

/**
 * Application of type mvc.
 *
 * @export
 * @class Application
 * @extends {Koa}
 */
@Singleton(ApplicationToken)
export class Application {

    private server: http.Server | https.Server;
    private koa: Koa;

    private _container: IContainer;
    private _loggerMgr: ILoggerManager;
    get container() {
        return this._container;
    }

    constructor(@Inject(symbols.IContainer) container: IContainer) {
        this._container = container;
    }

    getKoa(): Koa {
        if (!this.koa) {
            this.koa = new Koa();
        }
        return this.koa;
    }

    getConfiguration(): IConfiguration {
        return this.container.get(ConfigurationToken);
    }

    getLoggerManger(): ILoggerManager {
        if (!this._loggerMgr) {
            let cfg = this.getConfiguration();
            this._loggerMgr = this.container.resolve<IConfigureLoggerManager>(LogSymbols.IConfigureLoggerManager, { config: cfg.logConfig })
        }
        return this._loggerMgr;
    }


    getLogger(name?: string): ILogger {
        return this.getLoggerManger().getLogger(name);
    }

    getServer() {
        if (!this.server) {
            let cfg = this.getConfiguration();
            if (cfg.httpsOptions) {
                this.server = https.createServer(cfg.httpsOptions, this.getKoa().callback);
            } else {
                this.server = http.createServer(this.getKoa().callback());
            }
        }
        return this.server;
    }

    use(middleware: Koa.Middleware) {
        this.getKoa().use(middleware);
    }

}
