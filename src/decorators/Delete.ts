import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../util';

export interface DeleteMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Delete: IMethodDecorator = createMethodDecorator<DeleteMetadata>('Delete');
