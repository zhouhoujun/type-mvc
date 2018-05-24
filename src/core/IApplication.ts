import { InjectToken, IContainer, Token } from '@ts-ioc/core';
import { IConfiguration } from '../IConfiguration';
import { ILoggerManager, ILogger } from '@ts-ioc/logs';
import * as http from 'http';
// import * as http2 from 'http2';
import * as https from 'https';
import { IMiddleware } from './middlewares/index';
import { ServerMiddleware, IServerMiddleware } from './servers/index';

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

    readonly container: IContainer;

    configuration: IConfiguration;

    getServer(): any;

    getLoggerManger(): ILoggerManager;

    getLogger(name?: string): ILogger;

    getHttpServer(): http.Server | https.Server;

    use(middleware: Function);

    geDefaultMiddlewares(): InjectToken<IMiddleware>[];

    setup(beforeSMdls: (ServerMiddleware | Token<IServerMiddleware>)[], afterSMdls: (ServerMiddleware | Token<IServerMiddleware>)[]);

    setupRoutes(config: IConfiguration);

    setupMiddlewares(middlewares: Token<any>[], filter?: (token: Token<any>) => boolean);
}
