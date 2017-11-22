import { ObjectMap, Injectable, Singleton, Token } from 'type-autofac';



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
@Singleton
@Injectable
export class Configuration {
    constructor() {

    }
    port?= 3000;
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
    setting?: ObjectMap<any> = {};

    /**
     * ontrollers match path
     */
    middlewares?: string | string[] = ['./middlewares/**/*{.js,.ts}'];

    /**
     * use middlewars. if not config will load all.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    useMiddlewares?: Token<any>[] = [];

    /**
     * use controllers. if not config will load all.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    useControllers?: Token<any>[] = [];

    /**
     * controllers match. default `./controllers/*{.js,.ts}`.
     *
     * @type {(string | string[])}
     * @memberOf Configuration
     */
    controllers?: string | string[] = ['./controllers/**/*{.js,.ts}']
}
