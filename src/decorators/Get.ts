import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../util';

export interface GetMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Get: IMethodDecorator = createMethodDecorator<GetMetadata>('Get');

