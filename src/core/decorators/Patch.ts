import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator } from './Route';
import { PatchMetadata } from '../metadata/index';
import { IMethodDecorator } from '@ts-ioc/core';



/**
 * Patch decorator. define the route method as an Patch.
 *
 * @Patch
 *
 * @export
 * @interface IPatchDecorator
 * @template T
 */
export interface IPatchDecorator<T extends PatchMetadata> extends IMethodDecorator<T> {
    /**
     * Patch decorator. define the route method as an Patch.
     *
     * @Patch
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;
}

/**
 * Patch decorator. define the route method as patch.
 *
 * @Patch
 */
export const Patch: IPatchDecorator<PatchMetadata> = createRouteDecorator<PatchMetadata>(RequestMethod.Patch);
