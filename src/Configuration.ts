import { IMap } from './util';

export interface MiddlewareOptions {
    /**
     * middleware package name or directory.
     *
     * @type {string}
     * @memberOf MiddlewareOptions
     */
    middleware: string;
    options?: any;
}

/**
 * mvc configuration
 *
 * @export
 * @interface Configuration
 */
export class Configuration {
    /**
     * system file root directory.
     */
    rootdir?= './';
    /**
     * web site base url path. route prefix.
     *
     * @type {string}
     * @memberOf Configuration
     */
    routePrefix?= './';
    /**
     * key value setting.
     *
     * @type {IMap<any>}
     * @memberOf Configuration
     */
    setting?: IMap<any> = {};

    /**
     * List of directories from where to "require" all your middlewares.
     */
    middlewares?: (string | MiddlewareOptions)[] = [];

    /**
     * controllers match. default `./controllers/*{.js,.ts}`.
     *
     * @type {(string | string[])}
     * @memberOf Configuration
     */
    controllers?: string | string[] = ['./controllers/**/*{.js,.ts}']
}
