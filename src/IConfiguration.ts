import { ObjectMap, Injectable, Singleton, Token, Type } from '@ts-ioc/core';
import { LogConfigure } from '@ts-ioc/logs';
import { MvcSymbols } from './util/index';
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

export interface IConfiguration extends ObjectMap<any> {

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

    /**
     * session config.
     *
     * @type {ISessionConfig}
     * @memberof IConfiguration
     */
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
     * global cors default options.
     *
     * @type {CorsOptions}
     * @memberof Configuration
     */
    corsOptions?: CorsOptions;

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

    /**
     * used aop aspect.
     *
     * @type {Token<any>[]}
     * @memberof IConfiguration
     */
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

    /**
     * model options.
     *
     * @type {ModelOptions}
     * @memberof IConfiguration
     */
    modelOptions?: ModelOptions;

    /**
     * in debug log. defult false.
     *
     * @memberof IConfiguration
     */
    debug?: boolean;

    /**
     * log config
     *
     * @type {(LogConfigure | Type<LogConfigure>)}
     * @memberof IConfiguration
     */
    logConfig?: LogConfigure | Type<LogConfigure>;
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
