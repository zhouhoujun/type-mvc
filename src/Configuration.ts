import { ObjectMap, Injectable, Singleton, Token } from 'tsioc';
import { symbols } from './util';

/**
 * mvc configuration
 *
 * @export
 * @interface Configuration
 */
@Singleton
export class Configuration {
    constructor() {

    }
    port?= 3000;
    /**
     * system file root directory.
     */
    rootdir?= '';

    session?= {
        key: 'typemvc:sess', /** (string) cookie key (default is koa:sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 86400000,
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */
        rolling: false/** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
    };

    /**
     * contents path of files, static files. default in 'public'
     *
     * @type {(string | string[])}
     * @memberof Configuration
     */
    contents?: string[] = ['./public'];
    /**
     * web site base url path. route prefix.
     *
     * @type {string}
     * @memberOf Configuration
     */
    routePrefix?= '';
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
        symbols.BodyParserMiddleware,
        symbols.JsonMiddleware,
        symbols.LogMiddleware,
        symbols.ContentMiddleware,
        /**
         * this is container
         */
        symbols.ContextMiddleware,
        symbols.SessionMiddleware,
        symbols.ViewsMiddleware

    ];

    /**
     * the router middleware.
     *
     * @type {Token<any>}
     * @memberof Configuration
     */
    routerMiddlewate?: Token<any> = symbols.RouterMiddleware;

    /**
     * custom middleware match path, './middlewares/\*\*\/*{.js,.ts}' in your project.
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
     * controllers match. default `./controllers/\*\*\/*{.js,.ts}` in your project..
     *
     * @type {(string | string[])}
     * @memberOf Configuration
     */
    controllers?: string | string[] = ['./controllers/**/*{.js,.ts}'];

    /**
     * use controllers. if not config will load all.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    useControllers?: Token<any>[] = [];


    /**
     * views folder, default `./views` in your project.
     *
     * @memberof Configuration
     */
    views?= './views';

    /**
     * render view options.
     *
     * @memberof Configuration
     */
    viewsOptions?= {
        extension: 'ejs',
        map: { html: 'nunjucks' }
    };

}
