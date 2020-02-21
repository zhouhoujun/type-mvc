import { MethodMetadata } from '@tsdi/ioc';
import { RequestMethod } from '../RequestMethod';
import { MiddlewareType } from '../middlewares/IMiddleware';



/**
 * route metadata.
 *
 * @export
 * @interface RouteMetadata
 * @extends {MethodMetadata}
 */
export interface IRouteMetadata extends MethodMetadata {
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
     * middlewares
     *
     * @type {MiddlewareType[]}
     * @memberof RouteMetadata
     */
    middlewares?: MiddlewareType[]
}

/**
 * route metadata.
 *
 * @export
 * @interface RouteMetadata
 * @extends {IRouteMetadata}
 */
export interface RouteMetadata extends IRouteMetadata {
    /**
     * request method.
     *
     * @type {RequestMethod}
     * @memberof RouteMetadata
     */
    method?: RequestMethod;
}
