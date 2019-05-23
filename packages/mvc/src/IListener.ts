import { InjectToken } from '@tsdi/ioc';

/**
 * custom server listener
 *
 * @export
 * @interface IServerListener
 */
export interface IServerListener {
    listener(...args);
}

/**
 * server listener.
 */
export type ServerListener = IServerListener | ((...args) => void);

/**
 * server listener token.
 */
export const ServerListenerToken = new InjectToken<ServerListener>('server_listener');
