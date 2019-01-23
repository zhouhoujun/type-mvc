import * as http from 'http';
import { InjectToken } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';


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
     * start server withconfig.
     *
     * @param {IConfiguration} config
     * @memberof IMvcServer
     */
    start(config: IConfiguration);

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
