import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../util';

export interface HeadMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Head: IMethodDecorator = createMethodDecorator<HeadMetadata>('Head');
