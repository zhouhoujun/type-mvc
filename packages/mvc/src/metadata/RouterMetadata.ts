import { ClassMetadata } from '@tsdi/ioc';

/**
 * controller metadata
 *
 * @export
 * @interface RouterMetadata
 * @extends {ClassMetadata}
 */
export interface RouterMetadata extends ClassMetadata {
    /**
     * route prefix.
     *
     * @type {string}
     * @memberof RouterMetadata
     */
    routePrefix?: string;
}
