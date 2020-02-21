import { IMethodDecorator } from '@tsdi/ioc';
import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator } from './Route';
import { PatchMetadata } from '../metadata';
import { MiddlewareType } from '../middlewares/IMiddleware';



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

    /**
     * Patch decorator. define the route method as Patch.
     *
     * @Patch
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;
}

/**
 * Patch decorator. define the route method as patch.
 *
 * @Patch
 */
export const Patch: IPatchDecorator<PatchMetadata> = createRouteDecorator<PatchMetadata>(RequestMethod.Patch);
