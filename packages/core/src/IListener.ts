import { InjectToken } from '@ts-ioc/core';

/**
 * custom server listener
 *
 * @export
 * @interface IServerListener
 */
export interface IServerListener {
    listener(...args);
}

export type ServerListener = IServerListener | ((...args) => void);

export const ServerListenerToken = new InjectToken<ServerListener>('server_listener');
