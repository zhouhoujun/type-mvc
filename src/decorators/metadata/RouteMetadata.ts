import { MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../../RequestMethod';


export interface RouteMetadata extends MethodMetadata {
    route?: RegExp | string;
    method?: RequestMethod;
}
