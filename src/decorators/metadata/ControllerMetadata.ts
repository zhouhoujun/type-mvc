import { TypeMetadata } from 'type-autofac';


/**
 * controller metadata
 *
 * @export
 * @interface ControllerMetadata
 * @extends {ClassMetadata}
 */
export interface ControllerMetadata extends TypeMetadata {
    /**
     * route prefix.
     *
     * @type {string}
     * @memberof ControllerMetadata
     */
    routePrefix?: string;
}
