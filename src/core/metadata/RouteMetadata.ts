import { MethodMetadata } from '@ts-ioc/core';
import { RequestMethod } from '../RequestMethod';

/**
 * route metadata.
 *
 * @export
 * @interface RouteMetadata
 * @extends {MethodMetadata}
 */
export interface RouteMetadata extends MethodMetadata {
    /**
     * route.
     *
     * @type {string}
     * @memberof RouteMetadata
     */
    route?: string;

    /**
     * http content type.
     *
     * @type {string}
     * @memberof RouteMetadata
     */
    contentType?: string;
    /**
     * request method.
     *
     * @type {RequestMethod}
     * @memberof RouteMetadata
     */
    method?: RequestMethod;
}
