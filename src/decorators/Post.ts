import { MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator, IRouteDecorator } from './Route';

export interface PostMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Post: IRouteDecorator<PostMetadata> = createRouteDecorator<PostMetadata>('Post', RequestMethod.Post);

