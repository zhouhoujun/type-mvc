import { IApplication } from '../IApplication';
import { IContainer } from '@ts-ioc/core';


export type ServerMiddleware = (app: IApplication, container?: IContainer) => void;

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

