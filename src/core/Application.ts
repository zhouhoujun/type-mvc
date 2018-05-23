import { NonePointcut } from '@ts-ioc/aop';
import * as Koa from 'koa';
import { Injectable, Singleton, IContainer, AutoWired, Inject, Type, InjectToken, ContainerToken } from '@ts-ioc/core';
import * as http from 'http';
// import * as http2 from 'http2';
import * as https from 'https';
import { IConfiguration, ConfigurationToken } from '../IConfiguration';
import { ILogger, ILoggerManager, IConfigureLoggerManager, ConfigureLoggerManagerToken } from '@ts-ioc/logs';

/**
 * Application token.
 */
export const ApplicationToken = new InjectToken<IApplication>('__MVC_Application');

/**
 * Applaction interface.
 *
 * @export
 * @interface IApplication
 */
export interface IApplication {

    getKoa(): Koa;

    getConfiguration(): IConfiguration;

    getLoggerManger(): ILoggerManager;

    getLogger(name?: string): ILogger;

    getServer(): http.Server | https.Server;

    use(middleware: Koa.Middleware);
}

/**
 * Application of type mvc.
 *
 * @export
 * @class Application
 * @extends {Koa}
 */
@NonePointcut
@Singleton(ApplicationToken)
export class Application {

    private server: http.Server | https.Server;
    private koa: Koa;
    private _loggerMgr: ILoggerManager;

    @Inject(ContainerToken)
    container: IContainer;

    constructor() {

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
            this._loggerMgr = this.container.resolve<IConfigureLoggerManager>(ConfigureLoggerManagerToken, { config: cfg.logConfig })
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
