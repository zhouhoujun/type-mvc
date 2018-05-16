/**
 * mvc symbols
 */
export interface MvcSymbols {


    /**
     * Application symbol.
     */
    Application: symbol;

    /**
     * MVC Context
     * it is a symbol id, you can register yourself middleware for this.
     */
    IContext: symbol;

    /**
     * Authorization
     * it is a symbol id, you can register yourself middleware for this.
     */
    IAuthorization: symbol;

    /**
     * Configuration
     * it is a symbol id, you can register yourself middleware for this.
     */
    IConfiguration: symbol;


    /**
     * context middlwware is provider for context of request.
     * it is a symbol id, you can register yourself middleware for this.
     */
    ContextMiddleware: symbol;

    /**
     * content middlwware is static files server.
     * it is a symbol id, you can register yourself middleware for this.
     */
    ContentMiddleware: symbol;


    /**
     * Session middlwware is deal wtih session connect.
     * it is a symbol id, you can register yourself middleware for this.
     */
    SessionMiddleware: symbol;

    /**
     * log middlwware is deal with log for requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    LogMiddleware: symbol;


    /**
     * route middlwware is deal with route for requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    RouterMiddleware: symbol;

    /**
     * Cors middlwware is deal with route cors for requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    CorsMiddleware: symbol;


    /**
     * json middlwware is deal with request body as json for some requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    JsonMiddleware: symbol;

    /**
     * Body Parse middlwware is deal with request body for requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    BodyParserMiddleware: symbol;


    /**
     * view middlwware is render html for requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    ViewsMiddleware: symbol;
}


export const MvcSymbols: MvcSymbols = {

    /**
     * Application symbol.
     */
    Application: Symbol('Application'),

    /**
     * MVC Context
     * it is a symbol id, you can register yourself middleware for this.
     */
    IContext: Symbol('IContext'),

    /**
     * Authorization
     * it is a symbol id, you can register yourself middleware for this.
     */
    IAuthorization: Symbol('IAuthorization'),

    /**
     * Configuration
     * it is a symbol id, you can register yourself middleware for this.
     */
    IConfiguration: Symbol('IConfiguration'),


    /**
     * context middlwware is provider for context of request.
     * it is a symbol id, you can register yourself middleware for this.
     */
    ContextMiddleware: Symbol('ContextMiddleware'),

    /**
     * content middlwware is static files server.
     * it is a symbol id, you can register yourself middleware for this.
     */
    ContentMiddleware: Symbol('ContentMiddleware'),


    /**
     * Session middlwware is deal wtih session connect.
     * it is a symbol id, you can register yourself middleware for this.
     */
    SessionMiddleware: Symbol('SessionMiddleware'),

    /**
     * log middlwware is deal with log for requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    LogMiddleware: Symbol('LogMiddleware'),


    /**
     * route middlwware is deal with route for requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    RouterMiddleware: Symbol('RouterMiddleware'),

    /**
     * Cors middlwware is deal with route cors for requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    CorsMiddleware: Symbol('CorsMiddleware'),


    /**
     * json middlwware is deal with request body as json for some requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    JsonMiddleware: Symbol('JsonMiddleware'),

    /**
     * Body Parse middlwware is deal with request body for requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    BodyParserMiddleware: Symbol('BodyParserMiddleware'),


    /**
     * view middlwware is render html for requests.
     * it is a symbol id, you can register yourself middleware for this.
     */
    ViewsMiddleware: Symbol('ViewsMiddleware')

}

/**
 * mvc symbols
 */
export const mvcSymbols = MvcSymbols;
