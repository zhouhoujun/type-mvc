import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator, IRouteDecorator } from './Route';

export interface PutMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Put: IRouteDecorator<PutMetadata> = createRouteDecorator<PutMetadata>('Put', RequestMethod.Put);

