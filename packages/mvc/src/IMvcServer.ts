import { InjectToken } from '@tsdi/ioc';
import { IConfiguration } from './IConfiguration';


/**
 * server.
 *
 * @export
 * @interface IServer
 */
export interface IMvcServer {
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
