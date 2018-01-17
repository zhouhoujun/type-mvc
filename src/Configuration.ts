import { ObjectMap, Injectable, Singleton, Token, Type } from 'tsioc';
import { mvcSymbols } from './util/index';
import { RequestMethod } from './core';
import { ServerOptions } from 'https';
// import { ServerOptions as Http2Options } from 'http2';


export interface ISessionConfig {
    /** (string) cookie key (default is koa:sess) */
    key: string;
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: number;
    /** (boolean) can overwrite or not (default true) */
    overwrite: boolean;
    /** (boolean) httpOnly or not (default true) */
    httpOnly: boolean;
    /** (boolean) signed or not (default true) */
    signed: boolean;
    /**
     *
     * @type {false}
     * @memberof ISessionConfig
     */
    rolling: boolean;
}

export interface IViewOptions {
    extension: string,
    map?: ObjectMap<any>;
}

/**
 * model options
 *
 * @export
 * @interface ModelOptions
 */
export interface ModelOptions {
    classMetaname: string;
    fieldMetaname: string;
}

export interface IConfiguration {

    /**
     * aseert url match regexp.
     *
     * @type {RegExp}
     * @memberof IConfiguration
     */
    assertUrlRegExp?: RegExp;

    /**
     * route url match  regexp.
     *
     * @type {RegExp}
     * @memberof IConfiguration
     */
    routeUrlRegExp?: RegExp;
    /**
     * is Route url or not. default will exclude assert url.
     *
     * @param {string} ctxUrl
     * @returns {boolean}
     * @memberof IConfiguration
     */
    isRouteUrl?(ctxUrl: string): boolean;

    /**
     * https server options.
     *
     * @type {ServerOptions}
     * @memberof IConfiguration
     */
    httpsOptions?: ServerOptions;

    /**
     * server hostname
     *
     * @type {string}
     * @memberof IConfiguration
     */
    hostname?: string;
    /**
     * server port.
     *
     * @type {number}
     * @memberof IConfiguration
     */
    port?: number;
    /**
     * system file root directory.
     */
    rootdir?: string;

    session?: ISessionConfig;

    /**
     * contents path of files, static files. default in 'public'
     *
     * @type {(string | string[])}
     * @memberof Configuration
     */
    contents?: string[];
    /**
     * web site base url path. route prefix.
     *
     * @type {string}
     * @memberOf Configuration
     */
    routePrefix?: string;
    /**
     * custom config key value setting.
     *
     * @type {IMap<any>}
     * @memberOf Configuration
     */
    setting?: ObjectMap<any>;

    /**
     * custom config connections.
     *
     * @type {ObjectMap<any>}
     * @memberof Configuration
     */
    connections?: ObjectMap<any>;

    /**
     * some middleware befor custom middleware to deal with http request.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    beforeMiddlewares?: Token<any>[];

    /**
     * the router middleware.
     *
     * @type {Token<any>}
     * @memberof Configuration
     */
    routerMiddlewate?: Token<any>;

    /**
     * custom middleware match path, './middlewares/\*\*\/*{.js,.ts}' in your project.
     */
    middlewares?: string | string[];

    /**
     * some middleware after custom, router middleware to deal with http request.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    afterMiddlewares?: Token<any>[];

    /**
     * exclude some middlewares
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    excludeMiddlewares?: Token<any>[];

    /**
     * use middlewars. if not config will load all.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    useMiddlewares?: Token<any>[];


    /**
     * controllers match. default `./controllers/\*\*\/*{.js,.ts}` in your project..
     *
     * @type {(string | string[])}
     * @memberOf Configuration
     */
    controllers?: string | string[];

    /**
     * use controllers. if not config will load all.
     *
     * @type {Token<any>[]}
     * @memberof Configuration
     */
    useControllers?: Token<any>[];

    /**
     * aspect service path. default: './aop'
     *
     * @type {(string | string[])}
     * @memberof IConfiguration
     */
    aop?: string | string[];

    usedAops?: Token<any>[];
    /**
     * views folder, default `./views` in your project.
     *
     * @memberof Configuration
     */
    views?: string;

    /**
     * render view options.
     *
     * @memberof Configuration
     */
    viewsOptions?: IViewOptions;


    modelOptions?: ModelOptions;


    /**
     * log lib name. for require dynamic.
     *
     * @type {string}
     * @memberof IConfiguration
     */
    logLib?: string;

    /**
     * log format.
     *
     * @type {string}
     * @memberof IConfiguration
     */
    logFormat?: string;
    /**
     * in debug log. defult false.
     *
     * @memberof IConfiguration
     */
    debug?: boolean;

    /**
     * log config extentsion.
     *
     * @type {*}
     * @memberof Configuration
     */
    logConfig?: any;
}

export interface CorsOptions {
    credentials?: boolean;
    exposeHeaders?: string;
    keepHeadersOnError?: boolean;
    allowMethods?: string | (string | RequestMethod)[];

    allowHeaders?: string | string[];

    /**
     * for global default.
     *
     * @type {number}
     * @memberof CorsOptions
     */
    maxAge?: number;
}

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

    assertUrlRegExp?= /\/((\w|%|\.))+\.\w+$/;
    routeUrlRegExp?= null;
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
    hostname?= '';
    /**
     * port
     *
     * @memberof Configuration
     */
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
        mvcSymbols.BodyParserMiddleware,
        mvcSymbols.JsonMiddleware,
        mvcSymbols.LogMiddleware,
        mvcSymbols.SessionMiddleware,
        mvcSymbols.ContentMiddleware,
        mvcSymbols.ContextMiddleware,
        mvcSymbols.CorsMiddleware,
        mvcSymbols.ViewsMiddleware

    ];

    /**
     * the router middleware.
     *
     * @type {Token<any>}
     * @memberof Configuration
     */
    routerMiddlewate?: Token<any> = mvcSymbols.RouterMiddleware;

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


    modelOptions?: ModelOptions = null;

    /**
     * log lib name. for require dynamic.
     *
     * @type {string}
     * @memberof Configuration
     */
    logLib?: string;

    /**
     * in debug log. defult false.
     *
     * @memberof Configuration
     */
    debug? = false;

    logFormat? = 'method: %s    state: %s   args:%s     returning: %s   error: %s';

    /**
     * log config extentsion.
     *
     * @type {*}
     * @memberof Configuration
     */
    logConfig?: any;

    /**
     * global cors default options.
     *
     * @type {CorsOptions}
     * @memberof Configuration
     */
    corsOptions?: CorsOptions;
}
