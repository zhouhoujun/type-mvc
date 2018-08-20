import { ClassMetadata } from '@ts-ioc/core';

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
     * define middleware setup before one middleware.
     *
     * @type {string}
     * @memberof MiddlewareMetadata
     */
    before?: string;
    /**
     * define middleware setup after one middleware.
     *
     * @type {string}
     * @memberof MiddlewareMetadata
     */
    after?: string;
}
