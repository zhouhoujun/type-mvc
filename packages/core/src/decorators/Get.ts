import { createRouteDecorator } from './Route';
import { RequestMethod } from '../RequestMethod';
import { GetMetadata } from '../metadata';
import { IMethodDecorator } from '@ts-ioc/core';



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
}


/**
 * Get decorator. define the route method as get.
 *
 * @Get
 */
export const Get: IGetDecorator<GetMetadata> = createRouteDecorator<GetMetadata>(RequestMethod.Get);

