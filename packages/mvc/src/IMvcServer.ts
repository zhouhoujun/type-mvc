import * as http from 'http';
import { InjectToken } from '@ts-ioc/core';


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
export const MvcServerToken = new InjectToken<IMvcServer>('MVC_Server');
