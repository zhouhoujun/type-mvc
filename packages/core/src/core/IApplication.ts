import { InjectToken, IContainer, Token } from '@ts-ioc/core';
import { IConfiguration } from '../IConfiguration';
import { ILoggerManager, ILogger } from '@ts-ioc/logs';
import * as http from 'http';
// import * as http2 from 'http2';
import * as https from 'https';
import { IMiddleware, MiddlewareOrder } from './middlewares/index';
import { ServerMiddleware, IServerMiddleware } from './servers/index';

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

    getServer(): any;

    getLoggerManger(): ILoggerManager;

    getLogger(name?: string): ILogger;

    getHttpServer(): http.Server | https.Server;

    use(middleware: Function);

    middlewareOrder(): MiddlewareOrder;

    setup(beforeSMdls: (ServerMiddleware | Token<IServerMiddleware>)[], afterSMdls: (ServerMiddleware | Token<IServerMiddleware>)[]);

    setupRoutes(config: IConfiguration);

    setupMiddlewares(middlewares: MiddlewareOrder, filter?: (token: Token<IMiddleware>) => boolean);
}
