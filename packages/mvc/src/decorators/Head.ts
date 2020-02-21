import { IMethodDecorator } from '@tsdi/ioc';
import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator } from './Route';
import { HeadMetadata } from '../metadata';
import { MiddlewareType } from '../middlewares/IMiddleware';


/**
 * Head decorator. define the route method as head.
 *
 * @Head
 *
 * @export
 * @interface IHeadDecorator
 * @template T
 */
export interface IHeadDecorator<T extends HeadMetadata> extends IMethodDecorator<T> {
    /**
     * Head decorator. define the route method as head.
     *
     * @Head
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Head decorator. define the route method as head.
     *
     * @Head
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;
}


/**
 * Head decorator. define the route method as head.
 *
 * @Head
 */
export const Head: IHeadDecorator<HeadMetadata> = createRouteDecorator<HeadMetadata>(RequestMethod.Head);
