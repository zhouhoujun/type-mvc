import { Type, InjectToken } from '@tsdi/core';
import { LogConfigure } from '@tsdi/logs';


export const DbConfigurationToken = new InjectToken<IDbConfiguration>('db_config');

/**
 * configuration.
 *
 * @export
 * @interface IDbConfiguration
 */
export interface IDbConfiguration {
    /**
     * debug.
     *
     * @type {boolean}
     * @memberof IDbConfiguration
     */
    debug?: boolean;
    /**
     * connection string.
     *
     * @type {string}
     * @memberof IDbConfiguration
     */
    connectionString: string;
    /**
     * models folder or matchs
     *
     * @type {(string | string[])}
     * @memberof IDbConfiguration
     */
    models?: string | string[];
    /**
     * log config.
     *
     * @type {(LogConfigure | Type<LogConfigure>)}
     * @memberof IDbConfiguration
     */
    logConfig?: LogConfigure | Type<LogConfigure>;
}
