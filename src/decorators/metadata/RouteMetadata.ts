import { MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../../RequestMethod';

/**
 * route metadata.
 *
 * @export
 * @interface RouteMetadata
 * @extends {MethodMetadata}
 */
export interface RouteMetadata extends MethodMetadata {
    route?: RegExp | string;
    method?: RequestMethod;
}
