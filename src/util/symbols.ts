
export const ContextSymbol = Symbol('IContext');

export const ContainerSymbol = Symbol('IContainer');


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
 * Body Parse middlwware is deal with request body for requests.
 * it is a symbol id, you can register yourself middleware for this.
 */
export const BodyParserMiddleware = Symbol('BodyParserMiddleware');
