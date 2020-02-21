import { ClassMetadata } from '@tsdi/ioc';
import { MiddlewareType } from '../middlewares/IMiddleware';


/**
 * controller metadata
 *
 * @export
 * @interface ControllerMetadata
 * @extends {ClassMetadata}
 */
export interface ControllerMetadata extends ClassMetadata {
    /**
     * route prefix.
     *
     * @type {string}
     * @memberof ControllerMetadata
     */
    routePrefix?: string;

    /**
     * the middlewares for the route.
     *
     * @type {MiddlewareType[]}
     * @memberof ControllerMetadata
     */
    middlewares?: MiddlewareType[];
}
