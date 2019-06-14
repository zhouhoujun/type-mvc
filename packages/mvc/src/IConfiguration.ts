import { ObjectMap, Type, InjectToken } from '@tsdi/ioc';
import { LogConfigure } from '@tsdi/logs';
import { ServerOptions } from 'https';
import { Application } from 'koa';
import { RunnableConfigure } from '@tsdi/boot';
import { RequestMethod } from './RequestMethod';
import *  as Keygrip from 'keygrip';
import { IContext } from './IContext';


/**
 * seetion config.
 *
 * @export
 * @interface ISessionConfig
 */
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

/**
 * view options
 *
 * @export
 * @interface IViewOptions
 */
export interface IViewOptions {
    extension: string,
    map?: ObjectMap<any>;
}

export interface IConnectionOptions extends ObjectMap<any> {
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
    entities?: Type<any>[];
}

export interface IDeserializeUser {
    deserializeUser(obj: any, ctx?: IContext): Promise<any>;
}

export interface ISerializeUser {
    serializeUser(user: any, ctx: IContext): Promise<any>;
}

/**
 * strategy option.
 *
 * @export
 * @interface IStrategyOption
 */
export interface IStrategyOption extends ObjectMap<any> {
    element: string | Type<any>;
    name?: string;
    verify?: Function
}

export interface PassportConfigure {
    strategies: IStrategyOption[];
    serializers?: Type<ISerializeUser>[];
    deserializers?: Type<IDeserializeUser>[];
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
     * @type {(Application | Type<any>)}
     * @memberof SubSite
     */
    app: Application | Type<any> | ((configuration: IConfiguration) => Promise<Application>);
}

/**
 * Configuration.
 *
 * Mvc applaction configuration.
 *
 * @export
 * @interface IConfiguration
 * @extends {ObjectMap<any>}
 */
export interface IConfiguration extends RunnableConfigure {
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
     * sub sites.
     *
     * @type {SubSite[]}
     * @memberof IConfiguration
     */
    subSites?: SubSite[];
    /**
     * custom config key value setting.
     *
     * @type {IMap<any>}
     * @memberOf Configuration
     */
    setting?: ObjectMap<any>;
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
     * controllers match. default `./controllers/\*\*\/*{.js,.ts}` in your project..
     *
     * @type {(string | string[])}
     * @memberOf Configuration
     */
    controllers?: string | string[];
    /**
     * passports config.
     *
     * @memberof IConfiguration
     */
    passports?: PassportConfigure;
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
     * @type {Type<any>[]}
     * @memberof IConfiguration
     */
    usedAops?: Type<any>[];
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
     * @type {(string[] | Type<any>[])}
     * @memberOf Configuration
     */
    models?: string[] | Type<any>[];
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
 * cors options
 *
 * @export
 * @interface CorsOptions
 */
export interface CorsOptions {
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
