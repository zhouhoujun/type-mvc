import { ObjectMap, Type, InjectToken } from '@tsdi/ioc';
import { LogConfigure } from '@tsdi/logs';
import { RunnableConfigure } from '@tsdi/boot';
import { RequestMethod } from './RequestMethod';
import { ServerOptions } from 'https';
import * as Koa from 'koa';
import *  as Keygrip from 'keygrip';
import { IContext } from './IContext';
import { opts as SessionConfig } from 'koa-session';

/**
 * view options
 *
 * @export
 * @interface IViewOptions
 */
export interface IViewOptions {
    extension: string,
    map?: ObjectMap;
}

export interface IConnectionOptions extends ObjectMap {
    name?: string;
    /**
     * db type.
     */
    type: string;
    host: string;
    port: number;
    username?: string;
    password?: string;
    database: string;
    entities?: Type[];
    initDb?(connect: any): Promise<void>;
}

/**
 * configuration token.
 */
export const ConfigurationToken = new InjectToken<IConfiguration>('MVX_Configuration');

/**
 * sub sites.
 *
 * @export
 * @interface SubSite
 */
export interface SubSite {
    /**
     * sub app route prefix.
     *
     * @type {string}
     * @memberof SubSite
     */
    routePrefix: string;
    /**
     * sub app
     *
     * @type {(Koa | Type)}
     * @memberof SubSite
     */
    app: Koa | Type | ((configuration: IConfiguration) => Promise<Koa>);
}

/**
 * Configuration.
 *
 * Mvc applaction configuration.
 *
 * @export
 * @interface IConfiguration
 * @extends {ObjectMap}
 */
export interface MvcConfiguration extends RunnableConfigure {
    /**
     * cookies keys
     *
     * @type {(Keygrip | string[])}
     * @memberof IConfiguration
     */
    keys?: Keygrip | string[];
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
     * session config.
     *
     * @type {SessionConfig}
     * @memberof IConfiguration
     */
    session?: SessionConfig;
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
     * sub sites.
     *
     * @type {SubSite[]}
     * @memberof IConfiguration
     */
    subSites?: SubSite[];
    /**
     * custom config key value setting.
     *
     * @type {ObjectMap}
     * @memberOf Configuration
     */
    setting?: ObjectMap;
    /**
     * db config connections.
     *
     * @type {IConnectionOptions}
     * @memberof Configuration
     */
    connections?: IConnectionOptions;
    /**
     * global cors default options.
     *
     * @type {CorsOptions}
     * @memberof Configuration
     */
    corsOptions?: CorsOptions;
    /**
     * auto load middlewares match. default `[./middlewares\/**\/*{.js,.ts}, , '!./\**\/*.d.ts']` in your project..
     *
     * @type {(string | string[])}
     * @memberOf Configuration
     */
    loadMiddlewares?: string | string[];
    /**
     * auto load controllers match. default `[./controllers\/**\/*{.js,.ts}, , '!./\**\/*.d.ts']` in your project..
     *
     * @type {(string | string[])}
     * @memberOf Configuration
     */
    loadControllers?: string | string[];
    /**
     * aspect service path. default: './aop'
     *
     * @type {(string | string[])}
     * @memberof IConfiguration
     */
    aop?: string | string[];
    /**
     * used aops.
     *
     * @type {Type[]}
     * @memberof IConfiguration
     */
    usedAops?: Type[];
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
     * models match. default `['.\/models\/**\/*{.js,.ts}', '!.\/**\/*.d.ts']` in your project..
     *
     * @type {(string[] | Type[])}
     * @memberOf Configuration
     */
    models?: string[] | Type[];
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

/**
 * Configuration
 *
 * @export
 * @interface IConfiguration
 * @extends {MvcConfiguration}
 */
export interface IConfiguration extends MvcConfiguration  {

}



/**
 * cors options
 *
 * @export
 * @interface CorsOptions
 */
export interface CorsOptions {
    /**
     * origin.
     *
     * @memberof CorsOptions
     */
    origin?: string | ((ctx: IContext) => string | Promise<string>);
    /**
     * enable Access-Control-Allow-Credentials
     *
     * @type {boolean}
     * @memberof CorsOptions
     */
    credentials?: boolean;
    /**
     * set request Access-Control-Expose-Headers
     *
     * @type {string}
     * @memberof CorsOptions
     */
    exposeHeaders?: string;
    /**
     * keep headers on error.
     *
     * @type {boolean}
     * @memberof CorsOptions
     */
    keepHeadersOnError?: boolean;
    /**
     * allow cors request methods
     *
     * @type {(string | (string | RequestMethod)[])}
     * @memberof CorsOptions
     */
    allowMethods?: string | (string | RequestMethod)[];
    /**
     * allow cors request headers, 'Access-Control-Request-Headers'
     *
     * @type {(string | string[])}
     * @memberof CorsOptions
     */
    allowHeaders?: string | string[];
    /**
     * set cors cache max age.  Access-Control-Max-Age.
     *
     * @type {number}
     * @memberof CorsOptions
     */
    maxAge?: number;
}
