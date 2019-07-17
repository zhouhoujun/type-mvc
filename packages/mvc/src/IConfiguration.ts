import { ObjectMap, Type, InjectToken } from '@tsdi/ioc';
import { LogConfigure } from '@tsdi/logs';
import { ServerOptions } from 'https';
import * as Koa from 'koa';
import { RunnableConfigure } from '@tsdi/boot';
import { RequestMethod } from './RequestMethod';
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
}

export interface IDeserializeUser {
    deserializeUser(obj: any, ctx?: IContext): Promise<any>;
}

export type DeserializeUserOption = Type<IDeserializeUser> | ((obj: any, ctx?: IContext) => Promise<any>)

export interface ISerializeUser {
    serializeUser(user: any, ctx: IContext): Promise<any>;
}

export type SerializeUserOption = Type<ISerializeUser> | ((user: any, ctx: IContext) => Promise<any>);

export interface ITransformAuthInfo {
    authInfo(info, ctx: IContext): Promise<any>;
}

export type TransformAuthInfoOption = Type<ITransformAuthInfo> | ((info, ctx: IContext) => Promise<any>);

/**
 * strategy option.
 *
 * @export
 * @interface IStrategyOption
 */
export interface IStrategyOption extends ObjectMap {
    strategy: string | Type;
    name?: string;
    verify?: Function
}

export interface PassportConfigure {
    strategies: IStrategyOption[];
    serializers?: SerializeUserOption[];
    deserializers?: DeserializeUserOption[];
    authInfos?: TransformAuthInfoOption[];
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
