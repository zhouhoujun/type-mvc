import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../util';

export interface PostMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Post: IMethodDecorator = createMethodDecorator<PostMetadata>('Post');

