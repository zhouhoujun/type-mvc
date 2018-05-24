import { Singleton, ObjectMap, Token, Type } from '@ts-ioc/core';
import { IConfiguration, CorsOptions, ModelOptions } from './IConfiguration';
import { RequestMethod, RouterMiddlewareToken } from './core/index';
import { ServerOptions } from 'https';
import { LogConfigure } from '@ts-ioc/logs';

/**
 * mvc configuration
 *
 * @export
 * @interface Configuration
 */
@Singleton
export class Configuration implements IConfiguration {
    constructor() {

    }

    assertUrlRegExp = /\/((\w|%|\.))+\.\w+$/;
    routeUrlRegExp = null;
    isRouteUrl?(ctxUrl: string): boolean {
        let flag = !this.assertUrlRegExp.test(ctxUrl);
        if (flag && this.routeUrlRegExp) {
            return this.routeUrlRegExp.test(ctxUrl);
        }
        return flag;
    }

    /**
     * hostname.
     *
     * @memberof Configuration
     */
    hostname = '';
    /**
     * port
     *
     * @memberof Configuration
     */
    port = 3000;
    /**
     * system file root directory.
     */
    rootdir = '';

    session = {
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
    routePrefix = '';
    /**
     * custom config key value setting.
     *
     * @type {IMap<any>}
     * @memberOf Configuration
     */
    setting?: ObjectMap<any> = {};

    /**
     * custom config connections.
     *
     * @type {ObjectMap<any>}
     * @memberof Configuration
     */
    connections?: ObjectMap<any> = {};

    /**
     * some middleware befor router middleware to deal with http request.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    beforeMiddlewares?: Token<any>[] = [
    ];

    /**
     * the router middleware.
     *
     * @type {Token<any>}
     * @memberof Configuration
     */
    routerMiddlewate?: Token<any> = RouterMiddlewareToken;

    /**
     * custom middleware match path, './middlewares/\*\*\/*{.js,.ts}', '!.\/**\/*.d.ts\' in your project.
     */
    middlewares?: string | string[] = ['./middlewares/**/*{.js,.ts}', '!./**/*.d.ts'];

    /**
     * some middleware after router middleware to deal with http request.
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
     * used server Middlewares
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    usedServerMiddlewares?: Token<any>[] = [];

    /**
     * controllers match. default `./controllers/\*\*\/*{.js,.ts}`, '!.\/**\/*.d.ts\' in your project..
     *
     * @type {(string | string[])}
     * @memberOf Configuration
     */
    controllers?: string | string[] = ['./controllers/**/*{.js,.ts}', '!./**/*.d.ts'];

    /**
     * use controllers. if not config will load all.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    useControllers?: Token<any>[] = [];

    /**
     * global cors default options.
     *
     * @type {CorsOptions}
     * @memberof Configuration
     */
    corsOptions?: CorsOptions;

    /**
     * custom aop services. default './aop/\*\*\/*{.js,.ts}', '!.\/**\/*.d.ts\'
     *
     * @type {(string | string[])}
     * @memberof Configuration
     */
    aop?: string | string[] = ['./aop/**/*{.js,.ts}', '!./**/*.d.ts'];

    /**
     * used aop
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    usedAops?: Token<any>[] = [];

    /**
     * views folder, default `./views` in your project.
     *
     * @memberof Configuration
     */
    views = './views';

    /**
     * render view options.
     *
     * @memberof Configuration
     */
    viewsOptions = {
        extension: 'ejs',
        map: { html: 'nunjucks' }
    };


    modelOptions?: ModelOptions = null;

    /**
     * in debug log. defult false.
     *
     * @memberof Configuration
     */
    debug = false;

    logConfig?: LogConfigure | Type<LogConfigure>;
}
