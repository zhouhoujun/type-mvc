import { symbols } from 'tsioc';

export const IContext = Symbol('IContext');

/**
 * Authorization
 * it is a symbol id, you can register yourself middleware for this.
 */
export const IAuthorization = Symbol('IAuthorization');

/**
 * Configuration
 * it is a symbol id, you can register yourself middleware for this.
 */
export const IConfiguration = Symbol('IConfiguration');


/**
 * context middlwware is provider for context of request.
 * it is a symbol id, you can register yourself middleware for this.
 */
export const ContextMiddleware = Symbol('ContextMiddleware');

/**
 * content middlwware is static files server.
 * it is a symbol id, you can register yourself middleware for this.
 */
export const ContentMiddleware = Symbol('ContentMiddleware');


/**
 * Session middlwware is deal wtih session connect.
 * it is a symbol id, you can register yourself middleware for this.
 */
export const SessionMiddleware = Symbol('SessionMiddleware');

/**
 * log middlwware is deal with log for requests.
 * it is a symbol id, you can register yourself middleware for this.
 */
export const LogMiddleware = Symbol('LogMiddleware');


/**
 * log middlwware is deal with route for requests.
 * it is a symbol id, you can register yourself middleware for this.
 */
export const RouterMiddleware = Symbol('RouterMiddleware');


/**
 * json middlwware is deal with request body as json for some requests.
 * it is a symbol id, you can register yourself middleware for this.
 */
export const JsonMiddleware = Symbol('JsonMiddleware');

/**
 * Body Parse middlwware is deal with request body for requests.
 * it is a symbol id, you can register yourself middleware for this.
 */
export const BodyParserMiddleware = Symbol('BodyParserMiddleware');


/**
 * view middlwware is render html for requests.
 * it is a symbol id, you can register yourself middleware for this.
 */
export const ViewsMiddleware = Symbol('ViewsMiddleware');
