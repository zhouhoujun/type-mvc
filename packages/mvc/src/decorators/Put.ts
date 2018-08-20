import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator } from './Route';
import { PutMetadata } from '../metadata';
import { IMethodDecorator } from '@ts-ioc/core';


/**
 * Put decorator. define the route method as an Put.
 *
 * @Put
 *
 * @export
 * @interface IPutDecorator
 * @template T
 */
export interface IPutDecorator<T extends PutMetadata> extends IMethodDecorator<T> {
    /**
     * Put decorator. define the route method as an Put.
     *
     * @Put
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;
}

/**
 * Put decorator. define the route method as put.
 *
 * @Put
 */
export const Put: IPutDecorator<PutMetadata> = createRouteDecorator<PutMetadata>(RequestMethod.Put);

