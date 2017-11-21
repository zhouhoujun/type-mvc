import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { createRouteDecorator, IRouteDecorator } from './Route';
import { RequestMethod } from '../RequestMethod';


export interface GetMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Get: IRouteDecorator<GetMetadata> = createRouteDecorator<GetMetadata>('Get', RequestMethod.Get);

