import { InjectToken, IContainer, Type } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';
import { ILoggerManager, ILogger } from '@ts-ioc/logs';
import * as http from 'http';
import * as https from 'https';
import { IContext } from './IContext';
import { Next } from './util';
import { IMiddlewareChain } from './middlewares/MiddlewareChain';
import { IBoot, InjectModuleBuilderToken, InjectAnnotationBuilder, IConfigureManager } from '@ts-ioc/bootstrap';


/**
 * server.
 *
 * @export
 * @interface IServer
 */
export interface IMvcServer {
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
export const CoreServerToken = new InjectToken<IMvcServer>('MVX_CoreServer');

/**
 * Application token.
 */
export const ApplicationToken = new InjectToken<IApplication>('MVX_Application');

/**
 * app module builder token.
 */
export const AppModuleBuilderToken = new InjectModuleBuilderToken<IApplication>(ApplicationToken);

/**
 *  app build token
 */
export const AppBuilderToken = new InjectAnnotationBuilder<IApplication>(ApplicationToken);

/**
 * MVC Applaction interface.
 *
 * @export
 * @interface IApp
 */
export interface IApplication extends IBoot<IMvcServer> {

    /**
     * get all merged config.
     *
     * @returns {IConfiguration}
     * @memberof IApplication
     */
    getConfig(): IConfiguration;

    /**
     * get all registered controllers.
     *
     * @returns {Type<any>[]}
     * @memberof IApplication
     */
    getControllers(): Type<any>[];

    /**
     * get all registered middlewares
     *
     * @returns {Type<any>[]}
     * @memberof IApplication
     */
    getMiddlewares(): Type<any>[];

    /**
     * get all registered aops
     *
     * @returns {Type<any>[]}
     * @memberof IApplication
     */
    getAops(): Type<any>[];

    /**
     * config manager.
     *
     * @returns {IConfigureManager<IConfiguration>}
     * @memberof IApplication
     */
    getConfigureManager(): IConfigureManager<IConfiguration>;

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
     * @returns {IMvcServer}
     * @memberof IApplication
     */
    getServer(): IMvcServer;

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

}
