import { IConnection } from './IConnection';


export interface IRelationalConnection extends IConnection {
    /**
     * get connection string;
     *
     * @returns {string}
     * @memberof IConnection
     */
    getConnectionString(): string;
}
