import { Type } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';
import { ILoggerManager, ILogger } from '@ts-ioc/logs';
import { IMiddlewareChain } from './middlewares/MiddlewareChain';
import { IBoot, IConfigureManager, InjectRunnableToken, IRunnableBuilder } from '@ts-ioc/bootstrap';
import { IMvcServer, MvcServerToken, IMvcHostBuilder } from './IMvcServer';
import { IRouter } from './router';
import { CustomMiddleware } from './middlewares';


/**
 * Application token.
 */
export const ApplicationToken = new InjectRunnableToken(MvcServerToken);

/**
 * MVC Applaction interface.
 *
 * @export
 * @interface IApp
 */
export interface IApplication extends IBoot<IMvcServer> {
    /**
     * host builder
     *
     * @returns {IMvcHostBuilder}
     * @memberof IApplication
     */
    getHostBuilder(): IMvcHostBuilder;
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
     * get router.
     *
     * @returns {IRouter}
     * @memberof IApplication
     */
    getRouter(): IRouter;

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
     * use middleware.
     *
     * @param {*} middleware
     * @memberof IApplication
     */
    use(middleware: CustomMiddleware);

    /**
     * use middleware factory.
     *
     * @param {(core?: any, httpServer?: any) => CustomMiddleware} middlewareFactory
     * @memberof IApplication
     */
    useFac(middlewareFactory: (core?: any, httpServer?: any) => CustomMiddleware);

}
