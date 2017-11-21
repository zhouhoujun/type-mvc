import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { Router } from '../index';
import { createRouteDecorator } from './Route';
import { RequestMethod } from '../RequestMethod';

export interface DeleteMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Delete: IMethodDecorator<DeleteMetadata> = createRouteDecorator<DeleteMetadata>('Delete', RequestMethod.Delete);
