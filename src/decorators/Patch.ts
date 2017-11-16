import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../util';

export interface PatchMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Patch: IMethodDecorator = createMethodDecorator<PatchMetadata>('Patch');
