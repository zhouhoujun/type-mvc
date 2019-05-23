import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator } from './Route';
import { OptionsMetadata } from '../metadata';
import { IMethodDecorator } from '@tsdi/ioc';



/**
 * Options decorator. define the route method as an options.
 *
 * @Options
 *
 * @export
 * @interface IOptionsDecorator
 * @template T
 */
export interface IOptionsDecorator<T extends OptionsMetadata> extends IMethodDecorator<T> {
    /**
     * Options decorator. define the route method as an options.
     *
     * @Options
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;
}

/**
 * Options decorator. define the route method as an options.
 *
 * @Options
 */
export const Options: IOptionsDecorator<OptionsMetadata> = createRouteDecorator<OptionsMetadata>(RequestMethod.Options);
