import { ClassMetadata } from 'tsioc';


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
}
