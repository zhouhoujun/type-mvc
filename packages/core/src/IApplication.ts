import { InjectToken, IContainer } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';
import { ILoggerManager, ILogger } from '@ts-ioc/logs';
import * as http from 'http';
import * as https from 'https';
import { IContext } from './IContext';
import { Next } from './util';
import { IMiddlewareChain } from './middlewares/MiddlewareChain';


/**
 * server.
 *
 * @export
 * @interface IServer
 */
export interface IServer {
    /**
     * use middleware.
     *
     * @param {*} middleware
     * @memberof IServer
     */
    use(middleware: any);
    /**
     * http server callback
     *
     * @returns {(request: http.IncomingMessage, response: http.ServerResponse) => void}
     * @memberof IServer
     */
    callback(): (request: http.IncomingMessage, response: http.ServerResponse) => void;
}

/**
 * core server token. use as singleton.
 */
export const CoreServerToken = new InjectToken<IServer>('MVX_CoreServer');

/**
 * Application token.
 */
export const ApplicationToken = new InjectToken<IApplication>('MVX_Application');

/**
 * Applaction interface.
 *
 * @export
 * @interface IApplication
 */
export interface IApplication {

    /**
     * application container.
     *
     * @type {IContainer}
     * @memberof IApplication
     */
    container: IContainer;

    /**
     * application configuration.
     *
     * @type {IConfiguration}
     * @memberof IApplication
     */
    configuration: IConfiguration;

    /**
     * middleware chian.
     *
     * @type {IMiddlewareChain}
     * @memberof IApplication
     */
    getMiddleChain(): IMiddlewareChain;

    /**
     * get server.
     *
     * @returns {IServer}
     * @memberof IApplication
     */
    getServer(): IServer;

    /**
     * get logger manager.
     *
     * @returns {ILoggerManager}
     * @memberof IApplication
     */
    getLoggerManger(): ILoggerManager;

    /**
     * get default logger.
     *
     * @param {string} [name]
     * @returns {ILogger}
     * @memberof IApplication
     */
    getLogger(name?: string): ILogger;

    /**
     * get http server.
     *
     * @returns {(http.Server | https.Server)}
     * @memberof IApplication
     */
    getHttpServer(): http.Server | https.Server;

    /**
     * use middleware.
     *
     * @param {(context: IContext, next?: Next) => any} middleware
     * @memberof IApplication
     */
    use(middleware: (context: IContext, next?: Next) => any);

    /**
     * run application.
     *
     * @memberof IApplication
     */
    run();
}
