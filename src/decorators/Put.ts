import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../util';

export interface PutMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Put: IMethodDecorator = createMethodDecorator<PutMetadata>('Put');

