import { IMethodDecorator } from '@tsdi/ioc';
import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator } from './Route';
import { PostMetadata } from '../metadata';
import { MiddlewareType } from '../middlewares/IMiddleware';


/**
 * Post decorator. define the route method as an Post.
 *
 * @Post
 *
 * @export
 * @interface IPostDecorator
 * @template T
 */
export interface IPostDecorator<T extends PostMetadata> extends IMethodDecorator<T> {
    /**
     * Post decorator. define the route method as an Post.
     *
     * @Post
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;
    /**
     * Post decorator. define the route method as Post.
     *
     * @Post
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;
}

/**
 * Post decorator. define the route method as post.
 *
 * @Post
 */
export const Post: IPostDecorator<PostMetadata> = createRouteDecorator<PostMetadata>(RequestMethod.Post);

