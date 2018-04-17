import { Application } from '../Application';
import { IContainer } from '@ts-ioc/core';


export type ServerMiddleware = (app: Application, container?: IContainer) => void;

/**
 * server middleware inteface
 * @export
 * @interface IServerMiddleware
 */
export interface IServerMiddleware {
    /**
     * setup server middleware.
     *
     * @memberof IServerMiddleware
     */
    setup?();
}

