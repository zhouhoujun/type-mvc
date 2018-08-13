import { InjectToken, IContainer, Token } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';
import { ILoggerManager, ILogger } from '@ts-ioc/logs';
import * as http from 'http';
import * as https from 'https';
import { IMiddleware, MiddlewareOrder } from './middlewares';


/**
 * custom middleware.
 */
export type CustomMiddleware = (app: IApplication, container?: IContainer) => void;

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

    container: IContainer;

    configuration: IConfiguration;

    getServer(): IServer;

    getLoggerManger(): ILoggerManager;

    getLogger(name?: string): ILogger;

    getHttpServer(): http.Server | https.Server;

    middlewareOrder(): MiddlewareOrder;

    setup(beforeSMdls: (CustomMiddleware | Token<IMiddleware>)[], afterSMdls: (CustomMiddleware | Token<IMiddleware>)[]);

    setupRoutes(config: IConfiguration);

    setupMiddlewares(middlewares: MiddlewareOrder, filter?: (token: Token<IMiddleware>) => boolean);
}
