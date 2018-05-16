import { InjectToken } from '@ts-ioc/core';
import { Application, IRouter, IContext, IAuthorization, IMiddleware, ApplicationToken, ContextToken, AuthorizationToken, ContentMiddlewareToken, SessionMiddlewareToken, LogMiddlewareToken, RouterMiddlewareToken, CorsMiddlewareToken, JsonMiddlewareToken, BodyParserMiddlewareToken, ViewsMiddlewareToken } from './core/index';
import { IConfiguration, ConfigurationToken } from './IConfiguration';


/**
 * mvc symbols
 */
export interface MvcTokens {


    /**
     * Application token.
     */
    Application: InjectToken<Application>;

    /**
     * MVC Context
     * it is a token id, you can register yourself middleware for this.
     */
    IContext: InjectToken<IContext>;

    /**
     * Authorization
     * it is a token id, you can register yourself middleware for this.
     */
    IAuthorization: InjectToken<IAuthorization>;

    /**
     * Configuration
     * it is a token id, you can register yourself middleware for this.
     */
    IConfiguration: InjectToken<IConfiguration>;


    /**
     * context middlwware is provider for context of request.
     * it is a token id, you can register yourself middleware for this.
     */
    ContextMiddleware: InjectToken<IMiddleware>;

    /**
     * content middlwware is static files server.
     * it is a token id, you can register yourself middleware for this.
     */
    ContentMiddleware: InjectToken<IMiddleware>;


    /**
     * Session middlwware is deal wtih session connect.
     * it is a token id, you can register yourself middleware for this.
     */
    SessionMiddleware: InjectToken<IMiddleware>;

    /**
     * log middlwware is deal with log for requests.
     * it is a token id, you can register yourself middleware for this.
     */
    LogMiddleware: InjectToken<IMiddleware>;


    /**
     * route middlwware is deal with route for requests.
     * it is a token id, you can register yourself middleware for this.
     */
    RouterMiddleware: InjectToken<IRouter>;

    /**
     * Cors middlwware is deal with route cors for requests.
     * it is a token id, you can register yourself middleware for this.
     */
    CorsMiddleware: InjectToken<IMiddleware>;


    /**
     * json middlwware is deal with request body as json for some requests.
     * it is a token id, you can register yourself middleware for this.
     */
    JsonMiddleware: InjectToken<IMiddleware>;

    /**
     * Body Parse middlwware is deal with request body for requests.
     * it is a token id, you can register yourself middleware for this.
     */
    BodyParserMiddleware: InjectToken<IMiddleware>;


    /**
     * view middlwware is render html for requests.
     * it is a token id, you can register yourself middleware for this.
     */
    ViewsMiddleware: InjectToken<IMiddleware>;
}


export const MvcTokens: MvcTokens = {

    /**
     * Application token.
     */
    Application: ApplicationToken,

    /**
     * MVC Context
     * it is a token id, you can register yourself middleware for this.
     */
    IContext: ContextToken,

    /**
     * Authorization
     * it is a token id, you can register yourself middleware for this.
     */
    IAuthorization: AuthorizationToken,

    /**
     * Configuration
     * it is a token id, you can register yourself middleware for this.
     */
    IConfiguration: ConfigurationToken,


    /**
     * context middlwware is provider for context of request.
     * it is a token id, you can register yourself middleware for this.
     */
    ContextMiddleware: ContentMiddlewareToken,

    /**
     * content middlwware is static files server.
     * it is a token id, you can register yourself middleware for this.
     */
    ContentMiddleware: ContentMiddlewareToken,


    /**
     * Session middlwware is deal wtih session connect.
     * it is a token id, you can register yourself middleware for this.
     */
    SessionMiddleware: SessionMiddlewareToken,

    /**
     * log middlwware is deal with log for requests.
     * it is a token id, you can register yourself middleware for this.
     */
    LogMiddleware: LogMiddlewareToken,


    /**
     * route middlwware is deal with route for requests.
     * it is a token id, you can register yourself middleware for this.
     */
    RouterMiddleware: RouterMiddlewareToken,

    /**
     * Cors middlwware is deal with route cors for requests.
     * it is a token id, you can register yourself middleware for this.
     */
    CorsMiddleware: CorsMiddlewareToken,


    /**
     * json middlwware is deal with request body as json for some requests.
     * it is a token id, you can register yourself middleware for this.
     */
    JsonMiddleware: JsonMiddlewareToken,

    /**
     * Body Parse middlwware is deal with request body for requests.
     * it is a token id, you can register yourself middleware for this.
     */
    BodyParserMiddleware: BodyParserMiddlewareToken,


    /**
     * view middlwware is render html for requests.
     * it is a token id, you can register yourself middleware for this.
     */
    ViewsMiddleware: ViewsMiddlewareToken

}

/**
 * mvc tokens
 */
export const mvcSymbols = MvcTokens;

/**
 * mvc tokens
 */
export const MvcSymbols = MvcTokens;