import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { Router } from '../index';
import { createRouteDecorator, IRouteDecorator } from './Route';
import { RequestMethod } from '../RequestMethod';

export interface DeleteMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Delete: IRouteDecorator<DeleteMetadata> = createRouteDecorator<DeleteMetadata>('Delete', RequestMethod.Delete);
