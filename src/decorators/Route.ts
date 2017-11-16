import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../util';


export interface RouteMetadata extends MethodMetadata  {
    route?: string;
    method?: RequestMethod;
}
export const Route: IMethodDecorator = createMethodDecorator<RouteMetadata>('Route');
