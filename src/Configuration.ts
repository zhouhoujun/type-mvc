import { ObjectMap, Injectable, Singleton, Token } from 'type-autofac';
import {
    ContainerSymbol, ContextSymbol, SessionMiddleware,
    ContextMiddleware, LogMiddleware, RouterMiddleware
} from './util';

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
    rootdir?= '';

    /**
     * contents path of files, static files. default in 'public'
     *
     * @type {(string | string[])}
     * @memberof Configuration
     */
    contents?: string | string[] = 'public';
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
     * some middleware befor custom middleware to deal with http request.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    beforeMiddlewares?: Token<any>[] = [
        LogMiddleware,
        /**
         * this is container
         */
        ContextMiddleware,
        SessionMiddleware,
        ContextMiddleware

    ];

    /**
     * the router middleware.
     *
     * @type {Token<any>}
     * @memberof Configuration
     */
    routerMiddlewate?: Token<any> = RouterMiddleware;

    /**
     * custom middleware match path
     */
    middlewares?: string | string[] = ['./middlewares/**/*{.js,.ts}'];

    /**
     * some middleware after custom, router middleware to deal with http request.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    afterMiddlewares?: Token<any>[] = [
    ];

    /**
     * exclude some middlewares
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    excludeMiddlewares?: Token<any>[] = [];

    /**
     * use middlewars. if not config will load all.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    useMiddlewares?: Token<any>[] = [];


    /**
     * controllers match. default `./controllers/*{.js,.ts}`.
     *
     * @type {(string | string[])}
     * @memberOf Configuration
     */
    controllers?: string | string[] = ['./controllers/**/*{.js,.ts}']

    /**
     * use controllers. if not config will load all.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    useControllers?: Token<any>[] = [];
}
