import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator } from './Route';
import { HeadMetadata } from '../metadata';
import { IMethodDecorator } from '@tsdi/ioc';


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
}


/**
 * Head decorator. define the route method as head.
 *
 * @Head
 */
export const Head: IHeadDecorator<HeadMetadata> = createRouteDecorator<HeadMetadata>(RequestMethod.Head);
