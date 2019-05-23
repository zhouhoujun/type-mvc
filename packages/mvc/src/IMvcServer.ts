import { InjectToken, Type } from '@tsdi/ioc';
import { IConfiguration } from './IConfiguration';
import { ILogger } from '@tsdi/logs';


/**
 * server.
 *
 * @export
 * @interface IServer
 */
export interface IMvcServer {

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
     * init server with configure.
     *
     * @param {IConfiguration} config
     * @memberof IMvcServer
     */
    init(config: IConfiguration): void;

    /**
     * use middleware.
     *
     * @param {*} middleware
     * @memberof IServer
     */
    use(middleware: any);

    /**
     * use middleware factory.
     *
     * @param {(core?: any, httpServer?: any) => any} middlewareFactory
     * @memberof IMvcServer
     */
    useFac(middlewareFactory: (core?: any, httpServer?: any) => any);

    /**
     * get http server.
     *
     * @returns {*}
     * @memberof IMvcServer
     */
    getHttpServer(): any;

    /**
     * get default logger.
     *
     * @param {string} [name]
     * @returns {ILogger}
     * @memberof IApplication
     */
    getLogger(name?: string): ILogger;

    /**
     * start server.
     *
     * @memberof IMvcServer
     */
    start();

    /**
     * stop server.
     *
     * @memberof IMvcServer
     */
    stop();
}

/**
 * core server token. use as singleton.
 */
export const MvcServerToken = new InjectToken<IMvcServer>('MVC_Server');
