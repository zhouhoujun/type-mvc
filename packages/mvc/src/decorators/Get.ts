import { IMethodDecorator } from '@tsdi/ioc';
import { createRouteDecorator } from './Route';
import { RequestMethod } from '../RequestMethod';
import { GetMetadata } from '../metadata';
import { MiddlewareType } from '../middlewares';



/**
 * Get decorator. define the route method as get.
 *
 * @Get
 *
 * @export
 * @interface IGetDecorator
 * @template T
 */
export interface IGetDecorator<T extends GetMetadata> extends IMethodDecorator<T> {
    /**
     * Get decorator. define the route method as get.
     *
     * @Get
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Get decorator. define the route method as get.
     *
     * @Get
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;
}


/**
 * Get decorator. define the route method as get.
 *
 * @Get
 */
export const Get: IGetDecorator<GetMetadata> = createRouteDecorator<GetMetadata>(RequestMethod.Get);

