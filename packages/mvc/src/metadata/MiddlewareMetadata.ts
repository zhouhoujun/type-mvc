import { ClassMetadata, Type } from '@tsdi/ioc';
import { CompositeMiddleware, MvcMiddleware } from '../middlewares';

/**
 * middleware metadata.
 *
 * @export
 * @interface MiddlewareMetadata
 * @extends {ClassMetadata}
 */
export interface MiddlewareMetadata extends ClassMetadata {
    /**
     * define middleware name.
     *
     * @type {string}
     * @memberof MiddlewareMetadata
     */
    name?: string;

    /**
     * middleware used scope.
     *
     * @type {('global' | 'route')}
     * @memberof MiddlewareMetadata
     */
    scope?: 'global' | 'route';

    /**
     * the middleware reg in.
     *
     * @type {Type<CompositeMiddleware>}
     * @memberof MiddlewareMetadata
     */
    regIn?: Type<CompositeMiddleware>;
    /**
     * define middleware setup before one middleware.
     *
     * @type {(string | Type<MvcMiddleware>)}
     * @memberof MiddlewareMetadata
     */
    before?: string | Type<MvcMiddleware>;
    /**
     * define middleware setup after one middleware.
     *
     * @type {(string | Type<MvcMiddleware>)}
     * @memberof MiddlewareMetadata
     */
    after?: string | Type<MvcMiddleware>;
}
